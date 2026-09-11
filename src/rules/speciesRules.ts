import type { Answers, Level, Species } from "../types";

export interface SpeciesRule {
  id: string;
  species: Species;
  /** Returns a reason string when the rule applies. */
  applies: (ctx: { symptoms: string[]; answers: Answers }) => string | null;
  level: Level;
}

const picked = (answers: Answers, questionId: string, optionId: string) =>
  (answers[questionId] ?? []).includes(optionId);

/**
 * Species-specific safety rules. These run after the generic scoring and can
 * only raise the level, never lower it.
 */
export const speciesRules: SpeciesRule[] = [
  {
    id: "cat.urinary-blockage-risk",
    species: "cat",
    level: "URGENT",
    applies: ({ answers }) =>
      picked(answers, "urination.change", "no-urine") ||
      (picked(answers, "urination.change", "straining") && picked(answers, "urination.change", "crying"))
        ? "A cat straining or repeatedly attempting to urinate without producing urine can become a life-threatening situation very quickly. This needs prompt veterinary assessment."
        : null,
  },
  {
    id: "cat.not-eating-24h",
    species: "cat",
    level: "VETERINARY_ADVICE",
    applies: ({ answers }) =>
      picked(answers, "appetite.change", "refusing") &&
      (picked(answers, "appetite.duration", "1-2d") || picked(answers, "appetite.duration", "gt2d"))
        ? "Cats that stop eating for more than a day can develop further problems, so this is worth discussing with a veterinarian."
        : null,
  },
  {
    id: "cat.hiding-plus-change",
    species: "cat",
    level: "WATCH_CLOSELY",
    applies: ({ symptoms, answers }) =>
      picked(answers, "behavior.signs", "hiding") && symptoms.length > 1
        ? "Cats often hide when they feel unwell, so hiding together with other changes is worth watching closely."
        : null,
  },
  {
    id: "cat.breathing-open-mouth",
    species: "cat",
    level: "URGENT",
    applies: ({ answers }) =>
      picked(answers, "breathing.change", "open-mouth")
        ? "Open-mouth breathing in a cat is unusual and should be treated as urgent."
        : null,
  },
  {
    id: "dog.bloated-abdomen",
    species: "dog",
    level: "URGENT",
    applies: ({ answers }) =>
      picked(answers, "vomiting.flags", "bloated") ||
      (picked(answers, "vomiting.frequency", "repeated") && picked(answers, "vomiting.flags", "severe-pain"))
        ? "A swollen abdomen with unproductive retching in a dog can escalate quickly and needs prompt veterinary assessment."
        : null,
  },
  {
    id: "dog.exercise-intolerance",
    species: "dog",
    level: "VETERINARY_ADVICE",
    applies: ({ answers }) =>
      picked(answers, "coughing.pattern", "exercise") && picked(answers, "coughing.pattern", "night")
        ? "A cough that is worse at night and after exercise is worth having checked by a veterinarian."
        : null,
  },
  {
    id: "dog.limb-non-weight-bearing",
    species: "dog",
    level: "VETERINARY_ADVICE",
    applies: ({ answers }) =>
      picked(answers, "mobility.signs", "limping") && picked(answers, "mobility.signs", "pain")
        ? "Limping with obvious pain is worth having examined."
        : null,
  },
];

export function speciesContext(species: Species): string {
  return species === "cat"
    ? "Cats often hide signs of illness. Clear changes from your cat's normal routine can be meaningful even when they seem small."
    : "Dogs often keep going even when uncomfortable. Changes in appetite, energy or toileting are useful early signals.";
}
