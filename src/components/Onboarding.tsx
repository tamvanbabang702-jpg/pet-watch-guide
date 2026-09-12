import { useState } from "react";
import { AppShell, Card } from "./AppShell";
import { PetForm } from "./PetForm";
import { useAppState } from "../hooks/useAppState";

export function Onboarding() {
  const { addPet, setPreferences } = useAppState();
  const [step, setStep] = useState(0);

  return (
    <AppShell hideNav>
      <div className="anim-rise space-y-5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: i <= step ? "var(--brand)" : "var(--line)" }}
            />
          ))}
        </div>

        {step === 0 && (
          <Card className="space-y-4">
            <div className="text-5xl">🐾</div>
            <h1 className="text-2xl font-semibold tracking-tight">Healthy Pet Checker</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A calm, private way to think through what you are seeing in your dog or cat — what to
              watch, and when it is sensible to contact a veterinarian.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Everything you enter stays on this device. No account, no internet needed.
            </p>
            <button
              onClick={() => setStep(1)}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Get started
            </button>
          </Card>
        )}

        {step === 1 && (
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Please read this first</h2>
            <div className="space-y-3 text-sm leading-relaxed">
              <p className="rounded-xl bg-secondary p-3">
                <strong>What this app does:</strong> helps you describe what you have observed,
                points out signs that need attention, suggests what to monitor, and helps you decide
                when to seek veterinary care.
              </p>
              <p className="rounded-xl p-3" style={{ backgroundColor: "var(--urgent-soft)" }}>
                <strong>What it never does:</strong> diagnose an illness, name a condition, suggest
                medication or dosages, or replace a veterinarian.
              </p>
              <p className="text-muted-foreground">
                In an emergency, contact a veterinary practice or emergency clinic immediately.
              </p>
            </div>
            <button
              onClick={() => {
                setPreferences({ disclaimerAcknowledged: true });
                setStep(2);
              }}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              I understand
            </button>
          </Card>
        )}

        {step === 2 && (
          <Card className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Add your first pet</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Only a name and species are required. You can change everything later.
              </p>
            </div>
            <PetForm
              submitLabel="Save and continue"
              onSubmit={(pet) => {
                addPet(pet);
                setPreferences({ onboardingComplete: true });
              }}
            />
            <button
              onClick={() => setPreferences({ onboardingComplete: true })}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-muted-foreground"
            >
              Skip for now
            </button>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
