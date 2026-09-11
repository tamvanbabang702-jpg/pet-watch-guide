import { useCallback, useSyncExternalStore } from "react";
import type { AppState, JournalEntry, Pet, Preferences } from "../types";
import { clearState, createId, emptyState, loadState, saveState } from "../lib/storage";

let state: AppState = emptyState();
let hydrated = false;
let storageWorking = true;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = loadState();
  emit();
}

function setState(next: AppState) {
  state = next;
  storageWorking = saveState(next);
  emit();
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot = emptyState();
const getSnapshot = () => state;
const getServerSnapshot = () => serverSnapshot;

export function useAppState() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addPet = useCallback((pet: Omit<Pet, "id" | "createdAt">) => {
    const created: Pet = { ...pet, id: createId(), createdAt: new Date().toISOString() };
    setState({
      ...state,
      pets: [...state.pets, created],
      preferences: { ...state.preferences, selectedPetId: created.id },
    });
    return created;
  }, []);

  const updatePet = useCallback((id: string, patch: Partial<Pet>) => {
    setState({
      ...state,
      pets: state.pets.map((p) => (p.id === id ? { ...p, ...patch, id: p.id } : p)),
    });
  }, []);

  const deletePet = useCallback((id: string) => {
    const pets = state.pets.filter((p) => p.id !== id);
    setState({
      ...state,
      pets,
      // Journal entries are kept; they hold the pet name so history survives deletion.
      journal: state.journal.map((e) => (e.petId === id ? { ...e, petId: null } : e)),
      preferences: {
        ...state.preferences,
        selectedPetId:
          state.preferences.selectedPetId === id ? (pets[0]?.id ?? null) : state.preferences.selectedPetId,
      },
    });
  }, []);

  const selectPet = useCallback((id: string | null) => {
    setState({ ...state, preferences: { ...state.preferences, selectedPetId: id } });
  }, []);

  const addJournalEntry = useCallback((entry: Omit<JournalEntry, "id" | "createdAt">) => {
    const created: JournalEntry = { ...entry, id: createId(), createdAt: new Date().toISOString() };
    setState({ ...state, journal: [created, ...state.journal] });
    return created;
  }, []);

  const updateJournalEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setState({
      ...state,
      journal: state.journal.map((e) => (e.id === id ? { ...e, ...patch, id: e.id } : e)),
    });
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setState({ ...state, journal: state.journal.filter((e) => e.id !== id) });
  }, []);

  const setPreferences = useCallback((patch: Partial<Preferences>) => {
    setState({ ...state, preferences: { ...state.preferences, ...patch } });
  }, []);

  const clearAllData = useCallback(() => {
    clearState();
    setState(emptyState());
  }, []);

  const selectedPet = snapshot.pets.find((p) => p.id === snapshot.preferences.selectedPetId) ?? null;

  return {
    ...snapshot,
    selectedPet,
    storageWorking,
    addPet,
    updatePet,
    deletePet,
    selectPet,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    setPreferences,
    clearAllData,
  };
}

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => hydrated,
    () => false,
  );
}
