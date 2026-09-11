import type { AppState, JournalEntry, Pet, Preferences } from "../types";

const STORAGE_KEY = "hpc.app.state";
export const DATA_VERSION = 1;

export const emptyState = (): AppState => ({
  version: DATA_VERSION,
  pets: [],
  journal: [],
  preferences: {
    onboardingComplete: false,
    selectedPetId: null,
    disclaimerAcknowledged: false,
  },
});

const isArray = Array.isArray;

/** Defensive normaliser: anything unexpected in storage falls back to a safe value. */
function normalise(raw: unknown): AppState {
  const base = emptyState();
  if (!raw || typeof raw !== "object") return base;
  const obj = raw as Partial<AppState>;

  const pets: Pet[] = isArray(obj.pets)
    ? (obj.pets as Pet[]).filter(
        (p) => p && typeof p === "object" && typeof p.id === "string" && typeof p.name === "string",
      )
    : [];

  const journal: JournalEntry[] = isArray(obj.journal)
    ? (obj.journal as JournalEntry[]).filter(
        (e) =>
          e &&
          typeof e === "object" &&
          typeof e.id === "string" &&
          !!e.result &&
          typeof e.result.level === "string",
      )
    : [];

  const prefsRaw = (obj.preferences ?? {}) as Partial<Preferences>;
  const preferences: Preferences = {
    onboardingComplete: prefsRaw.onboardingComplete === true,
    selectedPetId: typeof prefsRaw.selectedPetId === "string" ? prefsRaw.selectedPetId : null,
    disclaimerAcknowledged: prefsRaw.disclaimerAcknowledged === true,
  };

  if (preferences.selectedPetId && !pets.some((p) => p.id === preferences.selectedPetId)) {
    preferences.selectedPetId = pets[0]?.id ?? null;
  }

  return { version: DATA_VERSION, pets, journal, preferences };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return normalise(JSON.parse(raw));
  } catch {
    // Corrupted or unreadable data: start from a clean, safe state.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — keep running in memory */
    }
    return emptyState();
  }
}

export function saveState(state: AppState): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing else we can do */
  }
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
