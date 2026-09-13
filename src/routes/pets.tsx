import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";
import { PetForm } from "../components/PetForm";
import { useAppState, useHydrated } from "../hooks/useAppState";

export const Route = createFileRoute("/pets")({
  head: () => ({
    meta: [
      { title: "My Pets — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Keep private local profiles for each dog or cat, including age, weight, lifestyle and everyday baseline behaviour.",
      },
      { property: "og:title", content: "My Pets — Healthy Pet Checker" },
      {
        property: "og:description",
        content: "Private, offline pet profiles stored only on your own device.",
      },
    ],
  }),
  component: PetsPage,
});

function PetsPage() {
  const hydrated = useHydrated();
  const { pets, selectedPet, addPet, updatePet, deletePet, selectPet } = useAppState();
  const [mode, setMode] = useState<{ kind: "list" | "add" } | { kind: "edit"; id: string }>({
    kind: "list",
  });

  if (!hydrated) {
    return (
      <div className="app-shell-bg flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading…</span>
      </div>
    );
  }

  if (mode.kind === "add") {
    return (
      <AppShell title="Add a pet" subtitle="Stored only on this device.">
        <Card>
          <PetForm
            onSubmit={(pet) => {
              addPet(pet);
              setMode({ kind: "list" });
            }}
            onCancel={() => setMode({ kind: "list" })}
          />
        </Card>
      </AppShell>
    );
  }

  if (mode.kind === "edit") {
    const pet = pets.find((p) => p.id === mode.id);
    if (!pet) {
      setMode({ kind: "list" });
      return null;
    }
    return (
      <AppShell title={`Edit ${pet.name}`}>
        <Card>
          <PetForm
            initial={pet}
            submitLabel="Save changes"
            onSubmit={(patch) => {
              updatePet(pet.id, patch);
              setMode({ kind: "list" });
            }}
            onCancel={() => setMode({ kind: "list" })}
          />
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="My pets"
      subtitle="Profiles help tailor the questions you are asked."
      action={
        <button
          onClick={() => setMode({ kind: "add" })}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Add
        </button>
      }
    >
      <div className="space-y-3">
        {pets.length === 0 && (
          <Card className="space-y-2">
            <h2 className="font-semibold">No pets yet</h2>
            <p className="text-sm text-muted-foreground">
              Add a dog or cat to save checks under their name. You can also run a check without a
              profile.
            </p>
          </Card>
        )}

        {pets.map((p) => (
          <Card key={p.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                {p.species === "cat" ? "🐈" : "🐕"}
              </span>
              <div className="flex-1">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {[
                    p.species === "cat" ? "Cat" : "Dog",
                    p.breed,
                    p.ageYears ? `${p.ageYears} yrs` : null,
                    p.weightKg ? `${p.weightKg} kg` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              {selectedPet?.id === p.id && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                  Selected
                </span>
              )}
            </div>
            {p.notes && <p className="text-sm text-muted-foreground">{p.notes}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => selectPet(p.id)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium"
              >
                Select
              </button>
              <button
                onClick={() => setMode({ kind: "edit", id: p.id })}
                className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium"
              >
                <Pencil className="size-4" /> Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Remove ${p.name}? Saved journal entries are kept.`)) deletePet(p.id);
                }}
                className="flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium"
                style={{ color: "var(--urgent)" }}
              >
                <Trash2 className="size-4" /> Remove
              </button>
            </div>
          </Card>
        ))}

        <Disclaimer />
      </div>
    </AppShell>
  );
}
