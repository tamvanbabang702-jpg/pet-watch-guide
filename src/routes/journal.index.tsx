import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { LevelBadge } from "../components/LevelBadge";
import { useAppState, useHydrated } from "../hooks/useAppState";
import { symptomById } from "../rules/symptomRules";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    meta: [
      { title: "Health Journal — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "A private, offline history of the checks you have saved, so you can spot changes in your dog or cat over time.",
      },
      { property: "og:title", content: "Health Journal — Healthy Pet Checker" },
      {
        property: "og:description",
        content: "Review saved observations and share a clear summary with your veterinarian.",
      },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  const hydrated = useHydrated();
  const { journal } = useAppState();

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  return (
    <AppShell title="Health journal" subtitle="Saved checks, stored only on this device.">
      <div className="space-y-3">
        {journal.length === 0 ? (
          <Card className="space-y-3">
            <h2 className="font-semibold">Nothing saved yet</h2>
            <p className="text-sm text-muted-foreground">
              When you finish a health check you can save it here and watch how things change.
            </p>
            <Link
              to="/check"
              className="inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Start a check
            </Link>
          </Card>
        ) : (
          journal.map((e) => (
            <Link
              key={e.id}
              to="/journal/$entryId"
              params={{ entryId: e.id }}
              className="block rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex-1">
                  <span className="block font-medium">{e.petName}</span>
                  <span className="block text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleString()}
                  </span>
                </span>
                <LevelBadge level={e.result.level} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {e.symptoms.map((s) => symptomById(s)?.label ?? s).join(", ") || "No signs selected"}
              </p>
            </Link>
          ))
        )}
        <Disclaimer />
      </div>
    </AppShell>
  );
}
