import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, Disclaimer } from "../components/AppShell";

const signs = [
  "Severe difficulty breathing, or breathing that is noisy and laboured at rest",
  "Blue, grey or unusually pale gums",
  "Collapse, fainting, or being unable to stand",
  "Unconsciousness or being unresponsive",
  "A seizure, or repeated seizures",
  "Severe or uncontrolled bleeding",
  "Possible poisoning — plants, medication, chemicals or unsafe human food",
  "Major trauma such as a road accident, fall, crush injury or animal attack",
  "Repeated attempts to urinate with no urine produced (especially male cats)",
  "A hard, swollen or very painful belly, or unproductive retching",
  "Repeated vomiting with an inability to keep water down",
  "Severe, uncontrolled pain",
  "A struggling birth, or prolonged straining during labour",
  "Heatstroke signs: heavy panting, distress and very hot to the touch",
];

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Warning Signs — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Signs in dogs and cats that mean a veterinarian should be contacted immediately, plus what to do while you get help.",
      },
      { property: "og:title", content: "Emergency Warning Signs for Dogs & Cats" },
      {
        property: "og:description",
        content: "Know the signs that mean your dog or cat needs veterinary attention right now.",
      },
    ],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  return (
    <AppShell title="Emergency warning signs" subtitle="If you see any of these, contact a veterinarian now.">
      <div className="space-y-4">
        <Card className="space-y-3" >
          <ul className="space-y-2.5">
            {signs.map((s) => (
              <li key={s} className="flex gap-3 text-sm leading-relaxed">
                <span
                  className="mt-1.5 inline-block size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--urgent)" }}
                  aria-hidden
                />
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="space-y-3">
          <h2 className="font-semibold">While you arrange help</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>Call the practice before travelling so they can prepare for your arrival.</li>
            <li>Keep your pet warm, quiet and gently restrained. Handle a painful pet carefully.</li>
            <li>Do not give food, water or any medication unless a veterinarian tells you to.</li>
            <li>
              If poisoning is possible, bring the packaging, plant or substance with you if it is
              safe to do so.
            </li>
            <li>Note the time signs started — it helps the veterinary team.</li>
          </ul>
        </Card>

        <Link
          to="/check"
          className="block rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
        >
          Not an emergency? Start a health check
        </Link>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
