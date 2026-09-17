import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { LevelBadge } from "../components/LevelBadge";
import { useAppState, useHydrated } from "../hooks/useAppState";
import {
  GENERAL_CONTEXT_ID,
  generalContextRule,
  selectableSymptoms,
  symptomById,
} from "../rules/symptomRules";
import { relevantRedFlags } from "../rules/redFlagRules";
import { evaluateCheck, levelMeta } from "../lib/engine";
import type { Answers, CheckResult, Species } from "../types";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Health Check — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Answer a few calm questions about your dog or cat and get clear guidance on what to monitor and when veterinary advice is appropriate.",
      },
      { property: "og:title", content: "Health Check — Healthy Pet Checker" },
      {
        property: "og:description",
        content:
          "A five-step owner observation check that explains what to monitor and when to contact a veterinarian.",
      },
    ],
  }),
  component: CheckPage,
});

const STEPS = ["Pet", "Signs", "Questions", "Context", "Warning signs"];

function CheckPage() {
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { pets, selectedPet, addJournalEntry } = useAppState();

  const [step, setStep] = useState(0);
  const [petId, setPetId] = useState<string | null>(selectedPet?.id ?? null);
  const [manualName, setManualName] = useState("");
  const [species, setSpecies] = useState<Species>(selectedPet?.species ?? "dog");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [saved, setSaved] = useState(false);

  const pet = pets.find((p) => p.id === petId) ?? null;
  const petName = pet?.name || manualName.trim() || "your pet";
  const effectiveSpecies = pet?.species ?? species;

  const questionRules = useMemo(
    () => symptoms.map((s) => symptomById(s)).filter(Boolean),
    [symptoms],
  );
  const flags = useMemo(
    () => relevantRedFlags(effectiveSpecies, symptoms),
    [effectiveSpecies, symptoms],
  );

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  function toggle(list: string[], id: string, setter: (v: string[]) => void) {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function answer(questionId: string, optionId: string, type: "single" | "multi") {
    setAnswers((prev) => {
      const current = prev[questionId] ?? [];
      if (type === "single") return { ...prev, [questionId]: [optionId] };
      return {
        ...prev,
        [questionId]: current.includes(optionId)
          ? current.filter((x) => x !== optionId)
          : [...current, optionId],
      };
    });
  }

  function finish() {
    const outcome = evaluateCheck({
      species: effectiveSpecies,
      petName,
      symptoms: [...symptoms, GENERAL_CONTEXT_ID],
      answers,
      redFlags,
    });
    setResult(outcome);
  }

  function save() {
    if (!result) return;
    const entry = addJournalEntry({
      petId: pet?.id ?? null,
      petName,
      species: effectiveSpecies,
      symptoms,
      answers,
      result,
    });
    setSaved(true);
    navigate({ to: "/journal/$entryId", params: { entryId: entry.id } });
  }

  if (result) {
    const meta = levelMeta[result.level];
    return (
      <AppShell title="Your result" subtitle="This is guidance, never a diagnosis.">
        <div className="space-y-4 anim-rise">
          <Card className="space-y-3" >
            <LevelBadge level={result.level} large />
            <h2 className="text-xl font-semibold tracking-tight" style={{ color: meta.tone }}>
              {result.headline}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
          </Card>

          <ResultList title="What you told us" items={result.toldUs} />
          <ResultList title="Why you are seeing this" items={result.reasons} />
          <ResultList title="What to monitor" items={result.monitor} />
          <ResultList title="Contact a veterinarian if" items={result.seekCareIf} />

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saved}
              className="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              Save to journal
            </button>
            <Link
              to="/"
              className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold"
            >
              Done
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Only a veterinarian can diagnose your pet.
          </p>
          <Disclaimer />
        </div>
      </AppShell>
    );
  }

  const canContinue =
    step === 0 ? Boolean(pet || manualName.trim()) : step === 1 ? symptoms.length > 0 : true;

  return (
    <AppShell title="Health check" subtitle={`Step ${step + 1} of 5 — ${STEPS[step]}`}>
      <div className="space-y-4">
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>

        {step === 0 && (
          <Card className="space-y-4">
            <h2 className="font-semibold">Who is this check for?</h2>
            {pets.length > 0 && (
              <ul className="space-y-2">
                {pets.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => {
                        setPetId(p.id);
                        setSpecies(p.species);
                      }}
                      aria-pressed={petId === p.id}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm ${
                        petId === p.id ? "border-primary bg-secondary" : "border-border bg-card"
                      }`}
                    >
                      <span aria-hidden>{p.species === "cat" ? "🐈" : "🐕"}</span>
                      <span className="flex-1 font-medium">{p.name}</span>
                      {petId === p.id && <Check className="size-4 text-primary" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Or check without saving a profile
              </p>
              <input
                value={manualName}
                onChange={(e) => {
                  setManualName(e.target.value);
                  setPetId(null);
                }}
                placeholder="Pet name"
                aria-label="Pet name"
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                {(["dog", "cat"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpecies(s)}
                    aria-pressed={!pet && species === s}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium capitalize ${
                      !pet && species === s
                        ? "border-primary bg-secondary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {s === "cat" ? "🐈 Cat" : "🐕 Dog"}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card className="space-y-3">
            <h2 className="font-semibold">What have you noticed?</h2>
            <p className="text-sm text-muted-foreground">Choose everything that applies.</p>
            <ul className="grid grid-cols-2 gap-2">
              {selectableSymptoms.map((s) => {
                const on = symptoms.includes(s.id);
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => toggle(symptoms, s.id, setSymptoms)}
                      aria-pressed={on}
                      className={`h-full w-full rounded-xl border px-3 py-3 text-left ${
                        on ? "border-primary bg-secondary" : "border-border bg-card"
                      }`}
                    >
                      <span className="block text-lg" aria-hidden>
                        {s.icon}
                      </span>
                      <span className="mt-1 block text-sm font-medium">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.blurb}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {questionRules.length === 0 && (
              <Card className="text-sm text-muted-foreground">
                No follow-up questions for what you selected.
              </Card>
            )}
            {questionRules.map((rule) => (
              <Card key={rule!.id} className="space-y-4">
                <h2 className="font-semibold">
                  <span aria-hidden>{rule!.icon} </span>
                  {rule!.label}
                </h2>
                {rule!.questions.map((q) => (
                  <QuestionBlock key={q.id} q={q} answers={answers} onAnswer={answer} />
                ))}
              </Card>
            ))}
          </div>
        )}

        {step === 3 && (
          <Card className="space-y-4">
            <h2 className="font-semibold">A little more context</h2>
            {generalContextRule.questions.map((q) => (
              <QuestionBlock key={q.id} q={q} answers={answers} onAnswer={answer} />
            ))}
          </Card>
        )}

        {step === 4 && (
          <Card className="space-y-3">
            <h2 className="font-semibold">Any of these right now?</h2>
            <p className="text-sm text-muted-foreground">
              These signs usually need veterinary attention without delay. Select any you can see.
            </p>
            <ul className="space-y-2">
              {flags.map((rf) => {
                const on = redFlags.includes(rf.id);
                return (
                  <li key={rf.id}>
                    <button
                      onClick={() => toggle(redFlags, rf.id, setRedFlags)}
                      aria-pressed={on}
                      className="flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left text-sm"
                      style={
                        on
                          ? { borderColor: "var(--urgent)", backgroundColor: "var(--urgent-soft)" }
                          : undefined
                      }
                    >
                      <span
                        className={`size-4 shrink-0 rounded border ${on ? "" : "border-border"}`}
                        style={on ? { backgroundColor: "var(--urgent)" } : undefined}
                        aria-hidden
                      />
                      <span className="flex-1">{rf.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => (step === 0 ? navigate({ to: "/" }) : setStep(step - 1))}
            className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <button
            onClick={() => (step === 4 ? finish() : setStep(step + 1))}
            disabled={!canContinue}
            className="flex flex-1 items-center justify-center gap-1 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {step === 4 ? "See guidance" : "Continue"}
            <ChevronRight className="size-4" />
          </button>
        </div>

        <Disclaimer />
      </div>
    </AppShell>
  );
}

function QuestionBlock({
  q,
  answers,
  onAnswer,
}: {
  q: { id: string; text: string; help?: string; type: "single" | "multi"; options: { id: string; label: string }[] };
  answers: Answers;
  onAnswer: (questionId: string, optionId: string, type: "single" | "multi") => void;
}) {
  const selected = answers[q.id] ?? [];
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{q.text}</legend>
      {q.help && <p className="text-xs text-muted-foreground">{q.help}</p>}
      <div className="space-y-2">
        {q.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button
              key={o.id}
              onClick={() => onAnswer(q.id, o.id, q.type)}
              aria-pressed={on}
              className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm ${
                on ? "border-primary bg-secondary font-medium" : "border-border bg-card"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((i, idx) => (
          <li key={`${idx}-${i}`} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
