export type Species = "dog" | "cat";

export type Level = "LOW_CONCERN" | "WATCH_CLOSELY" | "VETERINARY_ADVICE" | "URGENT";

export interface PetBaseline {
  appetite?: string;
  activity?: string;
  drinking?: string;
  urination?: string;
  stool?: string;
  behavior?: string;
}

export interface Pet {
  id: string;
  name: string;
  species: Species;
  sex?: "male" | "female" | "unknown";
  birthDate?: string;
  ageYears?: number;
  weightKg?: number;
  breed?: string;
  indoor?: "indoor" | "outdoor" | "both" | "unknown";
  neutered?: "yes" | "no" | "unknown";
  vaccination?: "up-to-date" | "partial" | "not-vaccinated" | "unknown";
  allergies?: string;
  notes?: string;
  photo?: string;
  baseline?: PetBaseline;
  createdAt: string;
}

/** answers[questionId] = array of selected option ids */
export type Answers = Record<string, string[]>;

export interface CheckResult {
  level: Level;
  headline: string;
  summary: string;
  toldUs: string[];
  reasons: string[];
  monitor: string[];
  seekCareIf: string[];
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  petId: string | null;
  petName: string;
  species: Species;
  symptoms: string[];
  answers: Answers;
  result: CheckResult;
  note?: string;
}

export interface Preferences {
  onboardingComplete: boolean;
  selectedPetId: string | null;
  disclaimerAcknowledged: boolean;
}

export interface AppState {
  version: number;
  pets: Pet[];
  journal: JournalEntry[];
  preferences: Preferences;
}
