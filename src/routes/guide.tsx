import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppShell, Card, Disclaimer } from "../components/AppShell";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Pet Health Guide — Healthy Pet Checker" },
      {
        name: "description",
        content:
          "Offline educational articles for dog and cat owners: normal baselines, hydration, appetite changes, breathing, vomiting, litter box habits and when to call a veterinarian.",
      },
      { property: "og:title", content: "Pet Health Guide — Healthy Pet Checker" },
      {
        property: "og:description",
        content:
          "Plain-language reading on what is typical for dogs and cats, and which changes are worth a veterinary conversation.",
      },
    ],
  }),
  component: GuidePage,
});

interface Article {
  id: string;
  title: string;
  species: "dog" | "cat" | "both";
  summary: string;
  body: string[];
}

const ARTICLES: Article[] = [
  {
    id: "baseline",
    title: "Knowing your pet's normal",
    species: "both",
    summary: "Why a personal baseline is the most useful thing you can record.",
    body: [
      "Healthy pets vary a lot from one another. A dog who normally naps most of the afternoon is not unwell simply because they are resting; a cat who usually greets you at the door may be telling you something by staying hidden.",
      "Write down what is typical for your pet when they are well: how much they eat, how often they drink, how much they move, how their stool looks, and how they behave around people.",
      "When something changes, compare it to that baseline rather than to a general rule. Changes from your pet's own normal are what a veterinarian will ask about first.",
    ],
  },
  {
    id: "hydration",
    title: "Drinking and hydration",
    species: "both",
    summary: "Signs of reduced drinking, and why sudden increases also matter.",
    body: [
      "Both drinking much less and drinking much more than usual can be meaningful. A noticeable, lasting change in thirst is worth mentioning to a veterinarian even if your pet seems otherwise comfortable.",
      "Always keep fresh water available and easy to reach. Some cats drink more from wide bowls or moving water.",
      "If a pet cannot keep water down, is repeatedly vomiting after drinking, or seems weak and unresponsive, this may be time-sensitive. Contact a veterinarian promptly rather than waiting.",
    ],
  },
  {
    id: "appetite",
    title: "Appetite changes",
    species: "both",
    summary: "How long is too long without eating, and what to watch alongside it.",
    body: [
      "Skipping a single meal after excitement, travel or a hot day is common. A pet who refuses food across more than one day is a different picture.",
      "Cats are more sensitive here: going without food for a prolonged period can create serious problems, so cats who stop eating should be discussed with a veterinarian sooner rather than later.",
      "Note anything that goes with the appetite change: vomiting, drooling, pawing at the mouth, weight loss, hiding, or low energy. That combination is more informative than appetite alone.",
    ],
  },
  {
    id: "breathing",
    title: "Breathing and effort",
    species: "both",
    summary: "What comfortable breathing looks like and what should never wait.",
    body: [
      "Resting breathing should look quiet and effortless, with no obvious belly push and no stretched-out neck.",
      "Open-mouth breathing in a cat who is not overheated or freshly exercised is always a reason to seek veterinary care promptly.",
      "Blue, grey, white or very pale gums, choking, constant coughing that prevents rest, or collapse are emergency signs. Seek veterinary care immediately.",
    ],
  },
  {
    id: "vomiting",
    title: "Vomiting and diarrhoea",
    species: "both",
    summary: "Single episodes versus repeated ones, and dehydration risk.",
    body: [
      "One isolated vomit in an otherwise bright, drinking, playful pet is often something to monitor for a day.",
      "Repeated vomiting, blood in vomit or stool, black tarry stool, a painful or swollen belly, or repeated unproductive retching are reasons to contact a veterinarian promptly.",
      "Young puppies and kittens, seniors, and pets with existing conditions become dehydrated much faster. Lower your threshold for calling in those cases.",
      "Never give human medication for an upset stomach. Only a veterinarian can advise what is safe for your pet.",
    ],
  },
  {
    id: "cat-urinary",
    title: "Cats and the litter box",
    species: "cat",
    summary: "Straining in a male cat can be a genuine emergency.",
    body: [
      "Frequent trips to the litter box with little or no urine, crying while trying to urinate, or licking at the back end can indicate a urinary problem.",
      "In male cats especially, a blockage can become life-threatening within hours. If your cat is straining and producing little or nothing, seek veterinary care immediately — do not wait to see if it improves overnight.",
      "Note what you see in the tray: amount, colour, blood, and how often. That detail helps the veterinary team act quickly.",
    ],
  },
  {
    id: "dog-bloat",
    title: "Dogs: swollen belly and retching",
    species: "dog",
    summary: "A combination that should never be watched at home.",
    body: [
      "A dog with a swollen or hard abdomen who is retching without bringing anything up, drooling, restless and unable to settle, needs emergency veterinary attention.",
      "This pattern is most often reported in deep-chested and larger breeds, but it is not limited to them.",
      "Do not attempt home remedies or wait for morning. Call the nearest emergency veterinary service on the way.",
    ],
  },
  {
    id: "mobility",
    title: "Limping and mobility changes",
    species: "both",
    summary: "Mild stiffness versus signs of real pain.",
    body: [
      "Brief stiffness after heavy activity that settles with rest is common. Ongoing limping, refusal to use a limb, or yelping when touched suggests genuine pain.",
      "Restrict activity while you arrange advice, and avoid stairs and jumping.",
      "Human painkillers are dangerous and sometimes fatal for dogs and cats. Never give them. Only a veterinarian can prescribe pain relief.",
    ],
  },
  {
    id: "skin",
    title: "Skin, coat and itching",
    species: "both",
    summary: "When scratching moves from a habit to a problem.",
    body: [
      "Persistent scratching, hair loss, scabs, redness, a bad smell, or licking one spot raw are worth a veterinary conversation — they rarely resolve on their own.",
      "Check for fleas, and keep parasite prevention up to date on veterinary advice.",
      "Sudden facial swelling, hives, or difficulty breathing after a bite, sting, food or medication may be an allergic reaction and needs urgent care.",
    ],
  },
  {
    id: "prevention",
    title: "Routine care that prevents problems",
    species: "both",
    summary: "Vaccination, dental care, weight and regular check-ups.",
    body: [
      "Regular veterinary check-ups catch quiet changes early, especially in senior pets.",
      "Keep vaccination and parasite prevention on the schedule your veterinarian recommends.",
      "Dental disease is common and painful. Bad breath, dropping food and pawing at the mouth deserve attention.",
      "Maintaining a healthy weight reduces strain on joints and organs. Your veterinary team can help you set a target.",
    ],
  },
  {
    id: "vet-visit",
    title: "Preparing for a veterinary visit",
    species: "both",
    summary: "What to bring and what to write down.",
    body: [
      "Note when the signs started, how often they happen, and whether they are getting better or worse.",
      "Record appetite, drinking, toileting, energy and any medication or supplements your pet receives.",
      "Photos and short videos of the behaviour are extremely helpful, especially for coughing, limping or seizures.",
      "The health journal in this app can produce a plain-text summary you can print or copy into a message.",
    ],
  },
  {
    id: "toxins",
    title: "Common household hazards",
    species: "both",
    summary: "Things that are ordinary for people and dangerous for pets.",
    body: [
      "Chocolate, xylitol sweetener, grapes and raisins, onions and garlic, alcohol, and many human medications are toxic to dogs and cats.",
      "Lilies are extremely dangerous to cats — even pollen or vase water can cause serious harm.",
      "Antifreeze, rodent bait, slug pellets and household cleaners cause severe poisoning.",
      "If you suspect your pet has swallowed something harmful, contact a veterinarian or poison line immediately, and bring the packaging. Do not try to make your pet vomit unless a veterinary professional tells you to.",
    ],
  },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "dog", label: "Dogs" },
  { id: "cat", label: "Cats" },
] as const;

function GuidePage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [open, setOpen] = useState<string | null>(null);

  const visible = ARTICLES.filter(
    (a) => filter === "all" || a.species === "both" || a.species === filter,
  );

  return (
    <AppShell
      title="Pet health guide"
      subtitle="Plain-language reading, available offline. Educational only."
    >
      <div className="space-y-4">
        <div role="group" aria-label="Filter articles" className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`flex-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.id
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visible.map((a) => {
            const isOpen = open === a.id;
            return (
              <Card key={a.id} className="p-0">
                <button
                  onClick={() => setOpen(isOpen ? null : a.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 p-4 text-left"
                >
                  <span className="flex-1">
                    <span className="block font-semibold">{a.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{a.summary}</span>
                  </span>
                  <ChevronDown
                    className={`mt-1 size-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-border px-4 pb-4 pt-3">
                    {a.body.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Link
          to="/emergency"
          className="block rounded-2xl p-4 text-sm font-semibold"
          style={{ backgroundColor: "var(--urgent-soft)", color: "var(--urgent)" }}
        >
          See emergency warning signs
        </Link>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
