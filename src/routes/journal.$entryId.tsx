import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardCopy, Trash2 } from "lucide-react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { LevelBadge } from "../components/LevelBadge";
import { useAppState, useHydrated } from "../hooks/useAppState";
import { symptomById } from "../rules/symptomRules";
import { buildVetSummary } from "../lib/vetSummary";
import { levelMeta } from "../lib/engine";

export const Route = createFileRoute("/journal/$entryId")({
  head: () => ({
    meta: [
      { title: "Saved Check — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Review a saved observation for your pet and generate a plain-language summary to bring to your veterinarian.",
      },
      { property: "og:title", content: "Saved Check — Healthy Pet Checker" },
      {
        property: "og:description",
        content: "A saved owner observation with monitoring notes and a vet-ready summary.",
      },
    ],
  }),
  component: EntryPage,
  errorComponent: () => (
    <AppShell title="This entry didn't load">
      <Card className="text-sm text-muted-foreground">
        Something went wrong opening this saved check.{" "}
        <Link to="/journal" className="font-medium text-primary">
          Back to the journal
        </Link>
      </Card>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell title="Entry not found">
      <Card className="text-sm text-muted-foreground">
        This saved check no longer exists.{" "}
        <Link to="/journal" className="font-medium text-primary">
          Back to the journal
        </Link>
      </Card>
    </AppShell>
  ),
});

function EntryPage() {
  const { entryId } = Route.useParams();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const { journal, updateJournalEntry, deleteJournalEntry } = useAppState();
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  const entry = journal.find((e) => e.id === entryId);
  if (!entry) {
    return (
      <AppShell title="Entry not found">
        <Card className="text-sm text-muted-foreground">
          This saved check no longer exists.{" "}
          <Link to="/journal" className="font-medium text-primary">
            Back to the journal
          </Link>
        </Card>
      </AppShell>
    );
  }

  const summary = buildVetSummary(entry);
  const meta = levelMeta[entry.result.level];

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShowSummary(true);
    }
  }

  return (
    <AppShell
      title={entry.petName}
      subtitle={new Date(entry.createdAt).toLocaleString()}
      action={<LevelBadge level={entry.result.level} />}
    >
      <div className="space-y-4">
        <Card className="space-y-2">
          <h2 className="text-lg font-semibold" style={{ color: meta.tone }}>
            {entry.result.headline}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{entry.result.summary}</p>
          <p className="text-xs text-muted-foreground">
            Signs reported:{" "}
            {entry.symptoms.map((s) => symptomById(s)?.label ?? s).join(", ") || "—"}
          </p>
        </Card>

        <Section title="What you told us" items={entry.result.toldUs} />
        <Section title="Why you saw this" items={entry.result.reasons} />
        <Section title="What to monitor" items={entry.result.monitor} />
        <Section title="Contact a veterinarian if" items={entry.result.seekCareIf} />

        <Card className="space-y-2">
          <h3 className="font-semibold">Your note</h3>
          <textarea
            value={entry.note ?? ""}
            onChange={(e) => updateJournalEntry(entry.id, { note: e.target.value })}
            rows={3}
            placeholder="Anything else you noticed…"
            aria-label="Your note"
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
        </Card>

        <Card className="space-y-3">
          <h3 className="font-semibold">Summary for your veterinarian</h3>
          <p className="text-sm text-muted-foreground">
            A plain-language record of what you observed. It contains no diagnosis.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copySummary}
              className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            >
              <ClipboardCopy className="size-4" /> {copied ? "Copied" : "Copy summary"}
            </button>
            <button
              onClick={() => setShowSummary((s) => !s)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium"
            >
              {showSummary ? "Hide" : "Show"} text
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium"
            >
              Print
            </button>
          </div>
          {showSummary && (
            <pre className="whitespace-pre-wrap rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
              {summary}
            </pre>
          )}
        </Card>

        <button
          onClick={() => {
            if (confirm("Delete this saved check?")) {
              deleteJournalEntry(entry.id);
              navigate({ to: "/journal" });
            }
          }}
          className="flex w-full items-center justify-center gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold"
          style={{ color: "var(--urgent)" }}
        >
          <Trash2 className="size-4" /> Delete entry
        </button>

        <Disclaimer />
      </div>
    </AppShell>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Card className="space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
