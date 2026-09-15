import { useState } from "react";
import type { Pet, Species } from "../types";

const field =
  "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export type PetDraft = Omit<Pet, "id" | "createdAt">;

export function PetForm({
  initial,
  submitLabel = "Save pet",
  onSubmit,
  onCancel,
}: {
  initial?: Partial<PetDraft>;
  submitLabel?: string;
  onSubmit: (pet: PetDraft) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [species, setSpecies] = useState<Species>(initial?.species ?? "dog");
  const [sex, setSex] = useState<string>(initial?.sex ?? "unknown");
  const [ageYears, setAgeYears] = useState(initial?.ageYears?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(initial?.weightKg?.toString() ?? "");
  const [breed, setBreed] = useState(initial?.breed ?? "");
  const [indoor, setIndoor] = useState<string>(initial?.indoor ?? "unknown");
  const [neutered, setNeutered] = useState<string>(initial?.neutered ?? "unknown");
  const [vaccination, setVaccination] = useState<string>(initial?.vaccination ?? "unknown");
  const [allergies, setAllergies] = useState(initial?.allergies ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please add a name so you can tell your pets apart.");
      return;
    }
    const draft: PetDraft = {
      name: name.trim(),
      species,
      sex: sex as NonNullable<Pet["sex"]>,
      indoor: indoor as NonNullable<Pet["indoor"]>,
      neutered: neutered as NonNullable<Pet["neutered"]>,
      vaccination: vaccination as NonNullable<Pet["vaccination"]>,
    };
    if (ageYears) draft.ageYears = Number(ageYears);
    if (weightKg) draft.weightKg = Number(weightKg);
    if (breed.trim()) draft.breed = breed.trim();
    if (allergies.trim()) draft.allergies = allergies.trim();
    if (notes.trim()) draft.notes = notes.trim();
    if (initial?.baseline) draft.baseline = initial.baseline;
    onSubmit(draft);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={label} htmlFor="pet-name">
          Name
        </label>
        <input
          id="pet-name"
          className={field}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Luna"
        />
      </div>

      <div>
        <span className={label}>Species</span>
        <div className="grid grid-cols-2 gap-2">
          {(["dog", "cat"] as Species[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpecies(s)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium capitalize transition-colors ${
                species === s
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {s === "dog" ? "🐕 Dog" : "🐈 Cat"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="pet-age">
            Age (years)
          </label>
          <input
            id="pet-age"
            className={field}
            inputMode="decimal"
            value={ageYears}
            onChange={(e) => setAgeYears(e.target.value)}
          />
        </div>
        <div>
          <label className={label} htmlFor="pet-weight">
            Weight (kg)
          </label>
          <input
            id="pet-weight"
            className={field}
            inputMode="decimal"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="pet-breed">
          Breed
        </label>
        <input
          id="pet-breed"
          className={field}
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="pet-sex">
            Sex
          </label>
          <select id="pet-sex" className={field} value={sex} onChange={(e) => setSex(e.target.value as Pet["sex"] as string)}>
            <option value="unknown">Not sure</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="pet-neutered">
            Neutered
          </label>
          <select
            id="pet-neutered"
            className={field}
            value={neutered}
            onChange={(e) => setNeutered(e.target.value as Pet["neutered"] as string)}
          >
            <option value="unknown">Not sure</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={label} htmlFor="pet-indoor">
            Lifestyle
          </label>
          <select
            id="pet-indoor"
            className={field}
            value={indoor}
            onChange={(e) => setIndoor(e.target.value as Pet["indoor"] as string)}
          >
            <option value="unknown">Not sure</option>
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="pet-vacc">
            Vaccination
          </label>
          <select
            id="pet-vacc"
            className={field}
            value={vaccination}
            onChange={(e) => setVaccination(e.target.value as Pet["vaccination"] as string)}
          >
            <option value="unknown">Not sure</option>
            <option value="up-to-date">Up to date</option>
            <option value="partial">Partial</option>
            <option value="not-vaccinated">Not vaccinated</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="pet-allergies">
          Known allergies
        </label>
        <input
          id="pet-allergies"
          className={field}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div>
        <label className={label} htmlFor="pet-notes">
          Notes
        </label>
        <textarea
          id="pet-notes"
          className={`${field} min-h-20`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything useful to remember"
        />
      </div>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
