import type { Species } from "../types";

export interface RedFlagRule {
  id: string;
  label: string;
  reason: string;
  /** Shown when no symptom filter matches, i.e. always relevant. */
  always?: boolean;
  /** Only shown when one of these symptoms was selected. */
  symptoms?: string[];
  /** Only shown for this species. */
  species?: Species;
}

/**
 * Red flags are always asked at the end of a check. Only the relevant ones are
 * shown, based on species and the symptoms the owner selected.
 */
export const redFlagRules: RedFlagRule[] = [
  {
    id: "rf.breathing",
    label: "Severe difficulty breathing",
    reason: "Severe difficulty breathing was reported.",
    always: true,
  },
  {
    id: "rf.gums",
    label: "Blue, grey or unusually pale gums",
    reason: "Abnormal gum colour was reported.",
    always: true,
  },
  { id: "rf.collapse", label: "Collapse or fainting", reason: "Collapse was reported.", always: true },
  {
    id: "rf.unconscious",
    label: "Unconsciousness or unresponsiveness",
    reason: "Your pet was described as unresponsive.",
    always: true,
  },
  { id: "rf.seizure", label: "A seizure or fit", reason: "A seizure was reported.", always: true },
  {
    id: "rf.bleeding",
    label: "Severe or uncontrolled bleeding",
    reason: "Severe bleeding was reported.",
    always: true,
  },
  {
    id: "rf.poison",
    label: "Possible poisoning (plants, medication, chemicals, human food)",
    reason: "Possible exposure to something toxic was reported.",
    always: true,
  },
  {
    id: "rf.trauma",
    label: "Major trauma (road accident, fall, crush injury, attack)",
    reason: "Major trauma was reported.",
    always: true,
  },
  {
    id: "rf.no-urine",
    label: "Repeated attempts to urinate with no urine produced",
    reason: "Repeated unproductive attempts to urinate is an urgent warning sign.",
    symptoms: ["urination", "pain", "behavior", "energy", "stool"],
  },
  {
    id: "rf.abdomen",
    label: "Severe abdominal swelling or a hard, painful belly",
    reason: "Severe abdominal swelling was reported.",
    symptoms: ["vomiting", "diarrhoea", "pain", "energy", "appetite", "stool"],
  },
  {
    id: "rf.no-water",
    label: "Repeated vomiting and unable to keep water down",
    reason: "Repeated vomiting with an inability to keep water down was reported.",
    symptoms: ["vomiting", "diarrhoea", "appetite", "drinking", "energy"],
  },
  {
    id: "rf.weakness",
    label: "Sudden severe weakness or inability to stand",
    reason: "Sudden severe weakness was reported.",
    always: true,
  },
  {
    id: "rf.pain",
    label: "Severe, uncontrolled pain",
    reason: "Severe uncontrolled pain was reported.",
    always: true,
  },
];

export function relevantRedFlags(species: Species, selectedSymptoms: string[]): RedFlagRule[] {
  return redFlagRules.filter((rf) => {
    if (rf.species && rf.species !== species) return false;
    if (rf.always) return true;
    return (rf.symptoms ?? []).some((s) => selectedSymptoms.includes(s));
  });
}
