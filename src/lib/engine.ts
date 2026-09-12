import type { Answers, CheckResult, Level, Species } from "../types";
import { symptomById, type RuleOption } from "../rules/symptomRules";
import { redFlagRules } from "../rules/redFlagRules";
import { speciesContext, speciesRules } from "../rules/speciesRules";

const ORDER: Level[] = ["LOW_CONCERN", "WATCH_CLOSELY", "VETERINARY_ADVICE", "URGENT"];

export const levelRank = (l: Level) => ORDER.indexOf(l);
export const raise = (a: Level, b: Level): Level => (levelRank(b) > levelRank(a) ? b : a);

export const levelMeta: Record<
  Level,
  { title: string; short: string; tone: string; soft: string; text: string }
> = {
  LOW_CONCERN: {
    title: "Low concern for now",
    short: "Low concern",
    tone: "var(--brand)",
    soft: "var(--brand-soft)",
    text: "Nothing you described points to an immediate problem, but keep observing.",
  },
  WATCH_CLOSELY: {
    title: "Worth watching closely",
    short: "Watch closely",
    tone: "var(--watch)",
    soft: "var(--watch-soft)",
    text: "These changes are worth monitoring carefully over the next day or two.",
  },
  VETERINARY_ADVICE: {
    title: "Veterinary advice is appropriate",
    short: "Vet advice",
    tone: "var(--advice)",
    soft: "var(--advice-soft)",
    text: "What you described is worth discussing with a veterinarian.",
  },
  URGENT: {
    title: "Contact a veterinarian now",
    short: "Urgent",
    tone: "var(--urgent)",
    soft: "var(--urgent-soft)",
    text: "One or more of the signs you described should be assessed without delay.",
  },
};

function selectedOptions(symptomIds: string[], answers: Answers) {
  const out: { questionText: string; option: RuleOption }[] = [];
  for (const sid of symptomIds) {
    const rule = symptomById(sid);
    if (!rule) continue;
    for (const q of rule.questions) {
      for (const optId of answers[q.id] ?? []) {
        const option = q.options.find((o) => o.id === optId);
        if (option) out.push({ questionText: q.text, option });
      }
    }
  }
  return out;
}

export interface EvaluateInput {
  species: Species;
  petName: string;
  symptoms: string[];
  answers: Answers;
  /** Ids of red-flag rules the owner confirmed. */
  redFlags: string[];
}

export function evaluateCheck(input: EvaluateInput): CheckResult {
  const { species, petName, symptoms, answers, redFlags } = input;
  const chosen = selectedOptions(symptoms, answers);

  let level: Level = "LOW_CONCERN";
  const reasons: string[] = [];

  // 1. Confirmed emergency warning signs always take priority.
  for (const id of redFlags) {
    const rf = redFlagRules.find((r) => r.id === id);
    if (rf) {
      level = "URGENT";
      reasons.push(rf.reason);
    }
  }

  // 2. Generic weighted scoring across the selected symptoms.
  let score = 0;
  let highest = 0;
  for (const { option } of chosen) {
    const w = option.weight ?? 0;
    score += w;
    highest = Math.max(highest, w);
    if (option.urgent) level = raise(level, "URGENT");
    if (option.reason && !reasons.includes(option.reason)) reasons.push(option.reason);
  }

  // More symptoms at once means a slightly stronger signal.
  if (symptoms.length >= 3) score += 1;

  let scored: Level = "LOW_CONCERN";
  if (highest >= 3 || score >= 8) scored = "VETERINARY_ADVICE";
  else if (highest >= 2 || score >= 4) scored = "WATCH_CLOSELY";
  level = raise(level, scored);

  // 3. Species-specific safety rules can only raise the level.
  for (const rule of speciesRules) {
    if (rule.species !== species) continue;
    const reason = rule.applies({ symptoms, answers });
    if (reason) {
      level = raise(level, rule.level);
      if (!reasons.includes(reason)) reasons.push(reason);
    }
  }

  if (reasons.length === 0) {
    reasons.push("Nothing you selected matched a pattern that usually needs prompt attention.");
  }
  reasons.push(speciesContext(species));

  const toldUs = chosen.map(({ questionText, option }) => `${questionText} — ${option.label}`);
  for (const id of redFlags) {
    const rf = redFlagRules.find((r) => r.id === id);
    if (rf) toldUs.unshift(`Warning sign confirmed — ${rf.label}`);
  }

  const monitor = new Set<string>();
  const seekCareIf = new Set<string>();
  for (const sid of symptoms) {
    const rule = symptomById(sid);
    if (!rule) continue;
    rule.monitor.forEach((m) => monitor.add(m));
    rule.seekCareIf.forEach((s) => seekCareIf.add(s));
  }
  seekCareIf.add("Breathing becomes difficult, or the gums look blue, grey or very pale");
  seekCareIf.add("Your pet collapses, has a seizure, or becomes unresponsive");

  const meta = levelMeta[level];
  const name = petName || "your pet";

  const summary =
    level === "URGENT"
      ? `Based on what you described about ${name}, this should be assessed by a veterinarian now. Contact your veterinary practice or an emergency clinic straight away.`
      : level === "VETERINARY_ADVICE"
        ? `Based on what you described about ${name}, arranging a veterinary appointment or calling for advice is a sensible next step.`
        : level === "WATCH_CLOSELY"
          ? `Based on what you described about ${name}, keep a close eye on the changes below. If anything worsens, contact a veterinarian.`
          : `Nothing you described about ${name} matched a pattern that usually needs prompt attention. Keep observing as usual.`;

  return {
    level,
    headline: meta.title,
    summary,
    toldUs,
    reasons,
    monitor: [...monitor],
    seekCareIf: [...seekCareIf],
  };
}
