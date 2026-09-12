import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ChevronRight, Stethoscope } from "lucide-react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { LevelBadge } from "../components/LevelBadge";
import { Onboarding } from "../components/Onboarding";
import { useAppState, useHydrated } from "../hooks/useAppState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Healthy Pet Checker — Dog & Cat Symptom Guidance" },
      {
        name: "description",
        content:
          "A calm, offline, private tool that helps dog and cat owners understand symptoms, know what to monitor, and decide when to contact a veterinarian.",
      },
      { property: "og:title", content: "Healthy Pet Checker — Dog & Cat Symptom Guidance" },
      {
        property: "og:description",
        content:
          "Understand what you are seeing in your dog or cat, learn what to monitor, and know when veterinary care is appropriate.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const hydrated = useHydrated();
  const { pets, journal, preferences, selectedPet, selectPet, storageWorking } = useAppState();

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (!preferences.onboardingComplete) return <Onboarding />;

  const recent = journal.slice(0, 3);

  return (
    <AppShell
      title={selectedPet ? `How is ${selectedPet.name} today?` : "Healthy Pet Checker"}
      subtitle="Describe what you have noticed and get calm, clear guidance."
    >
      <div className="space-y-4">
        {!storageWorking && (
          <Card className="text-sm text-muted-foreground">
            This device is not letting the app save data, so anything you record will be lost when
            you close the page.
          </Card>
        )}

        {pets.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {pets.map((p) => (
              <button
                key={p.id}
                onClick={() => selectPet(p.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedPet?.id === p.id
                    ? "border-primary bg-secondary text-foreground"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {p.species === "cat" ? "🐈" : "🐕"} {p.name}
              </button>
            ))}
          </div>
        )}

        <Link
          to="/check"
          className="flex items-center gap-4 rounded-2xl bg-primary p-5 text-primary-foreground anim-rise"
        >
          <Stethoscope className="size-8" strokeWidth={1.5} />
          <span className="flex-1">
            <span className="block text-lg font-semibold">Start a health check</span>
            <span className="block text-sm opacity-90">Takes about two minutes</span>
          </span>
          <ChevronRight className="size-5" />
        </Link>

        <Link
          to="/emergency"
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: "var(--urgent-soft)", color: "var(--urgent)" }}
        >
          <AlertTriangle className="size-6" strokeWidth={1.75} />
          <span className="flex-1 text-sm font-semibold">
            Emergency warning signs — what needs a vet now
          </span>
          <ChevronRight className="size-5" />
        </Link>

        {pets.length === 0 && (
          <Card className="space-y-3">
            <h2 className="font-semibold">No pets added yet</h2>
            <p className="text-sm text-muted-foreground">
              Adding a pet lets checks be saved under their name.
            </p>
            <Link
              to="/pets"
              className="inline-block rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
            >
              Add a pet
            </Link>
          </Card>
        )}

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent checks</h2>
            <Link to="/journal" className="text-sm font-medium text-primary">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Saved checks will appear here so you can spot changes over time.
            </p>
          ) : (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link
                    to="/journal/$entryId"
                    params={{ entryId: e.id }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                  >
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{e.petName}</span>
                      <span className="block text-xs text-muted-foreground">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                    <LevelBadge level={e.result.level} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="flex gap-2">
          <Link
            to="/guide"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold"
          >
            Care guide
          </Link>
          <Link
            to="/settings"
            className="flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-sm font-semibold"
          >
            Settings
          </Link>
        </div>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
