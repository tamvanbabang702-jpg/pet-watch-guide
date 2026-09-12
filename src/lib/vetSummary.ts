import type { JournalEntry } from "../types";
import { levelMeta } from "./engine";
import { symptomById } from "../rules/symptomRules";

export function buildVetSummary(entry: JournalEntry): string {
  const date = new Date(entry.createdAt).toLocaleString();
  const lines: string[] = [];

  lines.push(`Pet: ${entry.petName} (${entry.species === "cat" ? "Cat" : "Dog"})`);
  lines.push(`Observation recorded: ${date}`);
  lines.push("");
  lines.push(
    `Areas of concern: ${entry.symptoms.map((s) => symptomById(s)?.label ?? s).join(", ") || "—"}`,
  );
  lines.push("");
  lines.push("What the owner observed:");
  entry.result.toldUs.forEach((t) => lines.push(`  • ${t}`));
  lines.push("");
  lines.push(`Navigation guidance shown: ${levelMeta[entry.result.level].title}`);
  lines.push("");
  lines.push("Points highlighted:");
  entry.result.reasons.forEach((r) => lines.push(`  • ${r}`));
  if (entry.note) {
    lines.push("");
    lines.push(`Owner note: ${entry.note}`);
  }
  lines.push("");
  lines.push(
    "Note: this summary was produced by an educational owner-observation tool. It is not a diagnosis and contains no clinical interpretation.",
  );
  return lines.join("\n");
}
