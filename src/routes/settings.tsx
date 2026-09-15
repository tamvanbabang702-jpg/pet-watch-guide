import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { useAppState, useHydrated } from "../hooks/useAppState";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Manage your data in Healthy Pet Checker: everything is stored privately on this device, and you can export or erase it at any time.",
      },
      { property: "og:title", content: "Settings — Healthy Pet Checker" },
      {
        property: "og:description",
        content: "Private, offline data controls: export a copy or erase everything on this device.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const hydrated = useHydrated();
  const { pets, journal, preferences, storageWorking, setPreferences, clearAllData } = useAppState();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  const exportData = () => {
    try {
      const blob = new Blob([JSON.stringify({ pets, journal, preferences }, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `healthy-pet-checker-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage("A copy of your data has been saved to this device.");
    } catch {
      setMessage("This device would not let the app save a copy of your data.");
    }
  };

  return (
    <AppShell title="Settings" subtitle="Your data stays on this device.">
      <div className="space-y-4">
        {!storageWorking && (
          <Card className="text-sm text-muted-foreground">
            This device is not letting the app save data, so anything you record will be lost when
            you close the app.
          </Card>
        )}

        <Card className="space-y-2">
          <h2 className="font-semibold">Your data</h2>
          <p className="text-sm text-muted-foreground">
            {pets.length} {pets.length === 1 ? "pet" : "pets"} · {journal.length} saved{" "}
            {journal.length === 1 ? "check" : "checks"}
          </p>
          <p className="text-sm text-muted-foreground">
            Nothing is uploaded anywhere. There is no account and no internet connection is needed.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={exportData}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
            >
              Export a copy
            </button>
            <Link
              to="/pets"
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
            >
              Manage pets
            </Link>
          </div>
          {message && <p className="pt-1 text-sm text-muted-foreground">{message}</p>}
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold">Welcome screens</h2>
          <p className="text-sm text-muted-foreground">
            Show the introduction and safety notice again the next time you open the app.
          </p>
          <button
            onClick={() => {
              setPreferences({ onboardingComplete: false, disclaimerAcknowledged: false });
              setMessage("The introduction will show again next time you open the app.");
            }}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
          >
            Show introduction again
          </button>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold">Erase everything</h2>
          <p className="text-sm text-muted-foreground">
            This permanently removes every pet and saved check from this device. It cannot be
            undone.
          </p>
          {confirming ? (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  clearAllData();
                  setConfirming(false);
                  setMessage("Everything has been erased from this device.");
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--urgent)" }}
              >
                Yes, erase everything
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ backgroundColor: "var(--urgent-soft)", color: "var(--urgent)" }}
            >
              Erase all data
            </button>
          )}
        </Card>

        <Card className="space-y-2">
          <h2 className="font-semibold">About this app</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Healthy Pet Checker is an educational guidance tool for dog and cat owners. It does not
            diagnose conditions, does not suggest medication, and is not a substitute for
            professional care. Only a veterinarian can diagnose and treat your pet.
          </p>
          <Link to="/emergency" className="inline-block text-sm font-semibold text-primary">
            Emergency warning signs
          </Link>
        </Card>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
