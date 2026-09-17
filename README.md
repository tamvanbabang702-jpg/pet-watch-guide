# Pet Health Guide

Build a complete production-ready mobile-first web application called “Healthy Pet Checker”.

The app is an offline-first educational pet health navigation tool for dog and cat owners. It helps owners understand observed symptoms, identify potentially concerning warning signs, monitor changes, and decide when veterinary attention may be appropriate.

IMPORTANT PRODUCT POSITIONING:

This app is NOT a veterinary diagnostic tool.

Never diagnose a disease or condition.
Never claim that a pet definitely has a disease.
Never prescribe medication.
Never recommend medication dosages.
Never replace professional veterinary care.

The app should use careful language such as:

“This may be worth monitoring.”

“Consider contacting a veterinarian.”

“This combination of signs can be concerning.”

“Seek veterinary care promptly.”

“Only a veterinarian can diagnose your pet.”

The application must work fully offline after installation.

TECHNICAL REQUIREMENTS

Build with React + TypeScript.

Use Vite.

Mobile-first responsive design.

Designed primarily for Android/iOS phone screens.

Must work properly as a Capacitor Android application.

No backend.

No Supabase.

No Firebase.

No authentication.

No external database.

No AI API.

No paid API.

No network dependency for core functionality.

Store all user-created data in browser/device localStorage.

Store the built-in health knowledge and decision rules inside the application source.

Do not use TanStack unless absolutely necessary.

Keep dependencies lightweight.

Application must remain functional with airplane mode enabled.

Do not require an internet connection to perform health checks, view guides, or access saved pet information.

LOCAL STORAGE

Create a robust localStorage data layer with versioned data structures.

Store:

pets

health checks

health journal entries

pet baseline information

reminders if implemented

user preferences

onboarding completion state

Include safe JSON parsing and fallback behavior if localStorage contains corrupted or outdated data.

Do not store unnecessary personal information.

APP STRUCTURE

Create these main sections:

Home

Health Checker

My Pets

Health Journal

Pet Health Guide

Emergency Warning Signs

Settings

Use bottom navigation on mobile:

Home
Check
Journal
Guide
More

The “Check” button should be visually prominent.

BRAND AND VISUAL DESIGN

Brand name:

Healthy Pet Checker

Suggested tagline:

“Understand the signs. Know what to watch. Know when to call the vet.”

Design direction:

friendly

trustworthy

calm

modern

clean

approachable

professional without looking like a hospital

suitable for both dog and cat owners

Avoid an overly childish pet-store aesthetic.

Use rounded cards, generous spacing, large touch targets, clear hierarchy, subtle shadows, and friendly illustrations/icons.

Use a soft neutral background.

Use status colors consistently:

Green = lower concern / monitor
Yellow = watch closely
Orange = veterinary advice
Red = urgent

Do not rely on color alone. Every status must also contain text, iconography, and clear explanation.

Use accessible contrast.

Do not use excessive animations.

Use subtle transitions between question screens.

The application should feel fast and lightweight.

ONBOARDING

Create a short onboarding experience.

Screen 1:

Healthy Pet Checker

“Understand what you’re seeing and know what to do next.”

Screen 2:

“For dogs and cats”

“Check common symptoms, learn about warning signs, and keep a simple health history for your pets.”

Screen 3:

“Not a diagnosis”

“Healthy Pet Checker provides educational guidance and does not replace a veterinarian.”

Screen 4:

“Works offline”

“Your pet information and health journal stay on your device.”

Button:

“Get Started”

Allow the user to skip onboarding.

HOME SCREEN

Create a polished dashboard.

Header:

Healthy Pet Checker

Subtitle:

“Your pet’s everyday health companion.”

If pets exist, show the selected/recent pet.

Example:

Milo
Cat · 3 years

Primary CTA:

CHECK MY PET

Secondary actions:

My Pets
Health Journal
Pet Health Guide
Emergency Warning Signs

If no pets exist:

“Add your first pet”

Button:

“Add Pet”

Also show a compact emergency warning card:

“Know the red flags”

“Some symptoms require urgent veterinary attention.”

Button:

“View Warning Signs”

Include a small disclaimer near the bottom:

“Educational guidance only. This app does not diagnose or replace veterinary care.”

MY PETS

Allow users to create multiple pet profiles.

Pet fields:

name

species: Dog / Cat

sex

age or date of birth

approximate weight

breed

indoor/outdoor status

neutered/spayed status

vaccination status

known allergies or sensitivities

general notes

Do not require all fields.

Allow:

Add pet

Edit pet

Delete pet

Select pet

View pet health history

Pet profile card should show:

Name
Species
Age
Weight if available

Example:

Milo
Cat
3 years
4.2 kg

Allow optional pet photo, but do not make photo upload mandatory.

If no image is available, use a species illustration/icon.

HEALTH BASELINE

Allow owners to optionally record what is normal for their pet.

Examples:

Typical appetite:
Normal / variable

Typical activity:
Low / moderate / high

Typical drinking:
Normal

Typical urination:
Normal

Typical stool:
Normal

Typical behavior:
Social / independent / playful / etc.

The purpose is not to medically evaluate the pet.

The purpose is to help the owner identify changes from their pet’s normal behavior.

Display:

“What is normal for your pet?”

Then:

“What has changed?”

This should be used as contextual information during health checks.

HEALTH CHECKER

This is the main feature.

The experience should be a progressive multi-step questionnaire.

Do NOT display a giant form.

One logical question at a time or a small number of related questions per screen.

Progress indicator:

Step 1 of 5

STEP 1: SELECT PET

Choose an existing pet or continue without creating a profile.

STEP 2: WHAT HAVE YOU NOTICED?

Show large selectable cards:

Appetite
Drinking
Vomiting
Diarrhea
Stool changes
Urination
Breathing
Coughing
Sneezing
Energy / tiredness
Behavior changes
Pain / discomfort
Skin / fur
Eyes
Ears
Mouth / teeth
Weight changes
Walking / movement
Bleeding
Other

Allow multiple symptoms.

STEP 3: SYMPTOM DETAILS

Ask only relevant questions based on the selected symptoms.

Examples:

For vomiting:

“How often has your pet vomited?”

Once

2–3 times

Several times

Repeatedly / cannot keep food or water down

“When did it start?”

Less than 6 hours ago

Today

1–2 days ago

More than 2 days ago

“How is your pet behaving?”

Normal

Slightly quieter

Very tired

Extremely weak / difficult to wake

“Have you noticed any of these?”

Blood

Severe pain

Bloated abdomen

Difficulty breathing

Collapse

Cannot keep water down

None of these

For diarrhea:

Ask:

frequency

duration

blood

black/tarry appearance

vomiting

appetite

energy

ability to drink

severe abdominal discomfort

For appetite:

Ask:

reduced appetite

completely refusing food

duration

drinking

vomiting

diarrhea

energy

weight change

For drinking:

Ask:

noticeably increased drinking

decreased drinking

duration

increased urination

appetite

weight change

energy

For urination:

Ask:

increased frequency

decreased frequency

difficulty urinating

straining

crying/distress

blood

accidents

inability to urinate

For breathing:

Ask:

faster than normal

difficult breathing

coughing

open-mouth breathing

unusual breathing sounds

blue/gray/pale gums

collapse

For energy:

Ask:

slightly less active

noticeably tired

very weak

unable to stand normally

difficult to wake

sudden change

For pain/discomfort:

Ask:

mild

moderate

severe

sudden

persistent

hiding

vocalizing

unusual posture

difficulty moving

For skin/fur:

Ask:

itching

redness

hair loss

wounds

swelling

discharge

sudden widespread reaction

For eyes:

Ask:

redness

discharge

squinting

cloudiness

swelling

injury

sudden vision concern

For ears:

Ask:

scratching

head shaking

odor

discharge

swelling

pain

For walking/movement:

Ask:

limping

difficulty standing

difficulty walking

sudden inability to use limb

pain

injury/trauma

For bleeding:

Ask:

where the bleeding is

amount

whether it has stopped

trauma

weakness/collapse

STEP 4: GENERAL CONTEXT

Ask:

“How long has your pet seemed different?”

“How is your pet compared with normal?”

Mostly normal

A little different

Clearly not themselves

Very unwell

“Can your pet drink normally?”

“Yes”
“No”
“Not sure”

“Can your pet move normally?”

“Yes”
“No”
“Not sure”

For pets with profiles, use their stored baseline information when available.

STEP 5: RED FLAG SCREEN

Always check for critical warning signs.

Ask about relevant emergency signs.

Examples:

severe difficulty breathing

blue/gray/pale gums

collapse

unconsciousness

seizure

severe bleeding

suspected poisoning

major trauma

inability to urinate

severe abdominal swelling

repeated vomiting with inability to keep water down

sudden severe weakness

severe uncontrolled pain

Do not overwhelm the user with irrelevant questions. Only display relevant red flags based on species and selected symptoms.

DECISION ENGINE

Create a transparent rule-based health navigation engine.

Do not use AI or machine learning.

The engine should evaluate:

species

age category if available

selected symptoms

symptom severity

duration

frequency

associated symptoms

red flags

ability to eat

ability to drink

ability to urinate

energy level

trauma

suspected poisoning

baseline deviation

Return one of four navigation levels:

LOW_CONCERN
WATCH_CLOSELY
VETERINARY_ADVICE
URGENT

IMPORTANT:

Never return a disease diagnosis.

Never say:

“You have discovered diabetes.”

Instead say:

“Changes in thirst and urination can have several causes. If the change persists, veterinary evaluation may be appropriate.”

The engine should prioritize safety.

If a clear emergency red flag is present:

→ URGENT

If multiple concerning symptoms are present without an emergency:

→ VETERINARY_ADVICE

If a symptom is unusual or persistent but no strong red flags exist:

→ WATCH_CLOSELY

If the information describes a mild isolated change without concerning associated signs:

→ LOW_CONCERN

The exact rules should be organized in a maintainable data structure rather than scattered throughout UI components.

Example conceptual structure:

symptomRules.ts
redFlagRules.ts
speciesRules.ts
decisionEngine.ts

Keep all health rules easy to audit and modify later.

RESULT SCREEN

Create a highly polished result screen.

Example for LOW_CONCERN:

🟢

LOWER CONCERN

“Based on what you told us, there are no obvious urgent warning signs in this check.”

Then:

“What to do now”

Continue observing your pet.

Keep normal access to fresh water.

Pay attention to appetite, energy, bathroom habits, and behavior.

Recheck if the situation changes.

Then:

“When to reconsider”

“If symptoms persist, worsen, or new warning signs appear, consider contacting a veterinarian.”

For WATCH_CLOSELY:

🟡

WATCH CLOSELY

“Your pet has a change that is worth monitoring.”

Explain the reasons based on the user's answers.

For VETERINARY_ADVICE:

🟠

VETERINARY ADVICE

“The signs you reported may be worth discussing with a veterinarian.”

Explain exactly which reported factors triggered the recommendation.

For URGENT:

🔴

URGENT VETERINARY ATTENTION

“The information you provided includes warning signs that may require prompt veterinary assessment.”

Prominent message:

“Do not wait for this app if you believe your pet is experiencing an emergency.”

Buttons:

“Find veterinary care”
“View emergency guidance”

Since the app is offline-first, do not claim that the app can locate nearby veterinarians without internet access.

If implementing an external maps/contact action, make it an optional device capability and clearly distinguish it from the offline core.

RESULT EXPLANATION

Every result must contain:

What you told us

Why this result was shown

What you can monitor

When to seek veterinary care

Disclaimer

Example:

“What you told us”

Vomiting × 3
Reduced appetite
Symptoms started today
Energy slightly lower than normal

“Why this matters”

“Vomiting can happen for many reasons. The combination of repeated vomiting and reduced appetite is worth monitoring closely, especially if your pet becomes weaker or cannot keep water down.”

“Monitor”

vomiting frequency

water intake

appetite

energy

stool

urination

“Seek veterinary care promptly if”

vomiting becomes repeated

your pet cannot keep water down

blood appears

severe weakness develops

severe pain appears

breathing becomes abnormal

your pet collapses

HEALTH JOURNAL

Allow every completed health check to be saved.

Each journal entry should contain:

date/time

pet

symptoms

answers

result level

notes

Journal screen:

“My Health Journal”

Filter by pet.

Sort newest first.

Example:

September 11

Milo

Vomiting
2 episodes
Reduced appetite

🟡 Watch Closely

Allow:

View details

Add note

Delete entry

Create a timeline view for each pet.

VETERINARY VISIT SUMMARY

Add a feature:

“Prepare for the Vet”

Allow the user to generate a concise summary from journal data.

Example:

MILO
Cat · 3 years

MAIN CONCERN
Vomiting

FIRST NOTICED
September 10

OBSERVED SIGNS

Vomiting: 3 episodes

Appetite: reduced

Energy: slightly lower

Drinking: normal

Urination: normal

RECENT HISTORY

September 9
Normal

September 10
Reduced appetite
Vomiting

September 11
Vomiting continued

QUESTIONS FOR YOUR VETERINARIAN

What could be causing these symptoms?

What should I monitor at home?

What warning signs should make me return?

Does my pet need further evaluation?

Provide a clean printable/shareable format.

If PDF generation adds unnecessary complexity, initially provide a beautifully formatted print/share page using browser/device functionality. Keep the core app offline.

PET HEALTH GUIDE

Create an offline educational library.

Categories:

Cat Health
Dog Health
Appetite
Hydration
Vomiting
Diarrhea
Urination
Stool
Breathing
Coughing
Sneezing
Energy
Behavior
Skin & Fur
Eyes
Ears
Mouth & Teeth
Weight
Mobility
Preventive Care

Each article should be concise and practical.

Every article should contain:

What you may notice
Possible general explanations
What to monitor
When to contact a veterinarian
Emergency warning signs when relevant

Avoid definitive diagnosis.

Avoid medication recommendations.

Avoid dosage information.

Use educational language.

EMERGENCY WARNING SIGNS

Create a dedicated emergency reference page.

Title:

“Emergency Warning Signs”

Intro:

“Some symptoms can indicate a potentially serious problem. If your pet is experiencing an emergency, contact a veterinarian immediately rather than relying on this app.”

Sections:

BREATHING

severe difficulty breathing

blue, gray, or unusually pale gums

sudden collapse associated with breathing problems

NEUROLOGICAL

seizure

unconsciousness

sudden inability to stand

severe disorientation

TRAUMA

major bleeding

serious injury

suspected poisoning

being hit by a vehicle

URINATION

repeated attempts to urinate without producing urine

severe distress while attempting to urinate

GENERAL

collapse

severe weakness

uncontrolled pain

severe abdominal swelling

repeated vomiting with inability to keep water down

Make the page extremely easy to scan.

CAT-SPECIFIC GUIDANCE

Include cat-specific contextual rules and educational content.

Pay particular attention to:

urination

litter box behavior

hiding

appetite

drinking

vomiting

grooming

breathing

mobility

sudden behavior changes

Explain that cats can hide signs of illness and that noticeable changes from normal behavior may deserve attention.

For urinary concerns, be particularly conservative.

If a cat repeatedly attempts to urinate without producing urine, especially with distress:

→ URGENT

Do not diagnose urinary blockage.

DOG-SPECIFIC GUIDANCE

Include dog-specific contextual rules and educational content.

Pay attention to:

vomiting

diarrhea

appetite

drinking

exercise tolerance

coughing

limping

skin

ears

allergies

trauma

behavior changes

For suspected poisoning or major trauma:

→ URGENT

SETTINGS

Settings should include:

Data & Privacy

Clear All Local Data

Disclaimer

About

App version

Clearly explain:

“Your pet profiles and journal data are stored locally on this device.”

“Healthy Pet Checker does not send your pet information to a server.”

Before clearing all data, show a confirmation dialog.

DATA PRIVACY

Create a simple privacy screen:

“Your Data Stays on Your Device”

Explain that:

pet profiles are stored locally

journal entries are stored locally

the app does not require an account

the core checker does not require internet

deleting app data may remove locally stored information

Do not make unsupported claims about platform-level privacy.

DISCLAIMER

Use a clear disclaimer throughout the app.

Primary disclaimer:

“Healthy Pet Checker is an educational pet-health navigation tool. It does not diagnose diseases, prescribe treatment, or replace professional veterinary care.”

Emergency disclaimer:

“If you believe your pet is experiencing an emergency, contact a veterinarian or emergency veterinary service immediately. Do not delay urgent care to use this app.”

Do not hide the disclaimer behind a tiny link.

ACCESSIBILITY

Implement:

large tap targets

readable typography

strong contrast

semantic buttons

keyboard accessibility where applicable

visible focus states

screen-reader-friendly labels

icons accompanied by text

never communicate critical information using color alone

ERROR STATES

Handle:

no pets

no journal entries

corrupted localStorage

incomplete health check

deleted pet with existing journal entries

unexpected localStorage failure

Never allow the UI to crash because localStorage data is missing.

EMPTY STATES

Create polished empty states.

No pets:

“Your pets will appear here.”

“No pet profile yet? Add one to make health checks more personalized.”

No journal:

“Your health history is empty.”

“Complete a health check to start building a timeline.”

MOBILE UX

Optimize for mobile.

Use:

bottom navigation

sticky primary action where appropriate

safe-area support for modern phones

responsive cards

large touch targets

minimal typing

progressive disclosure

smooth transitions

Avoid desktop-style tables.

On larger screens, constrain the application to a comfortable mobile/tablet reading width instead of stretching everything across the entire screen.

CAPACITOR / ANDROID READINESS

The project must be suitable for export to Android Studio using Capacitor.

Do not depend on browser-only functionality that will break inside Android WebView.

Ensure:

localStorage works inside WebView

navigation works offline

no hardcoded localhost URLs

no backend requirement

no external API requirement for core functionality

responsive viewport configuration

Android back navigation is considered

status bar/safe area spacing is handled correctly

Do not create a fake native wrapper. The application itself should be mobile-optimized.

CODE ORGANIZATION

Keep architecture clean.

Suggested structure:

src/
components/
pages/
data/
symptoms/
guides/
rules/
engine/
decisionEngine.ts
redFlagEngine.ts
hooks/
lib/
storage.ts
types/
utils/

Separate:

UI
from
health decision logic
from
local storage
from
static educational content.

Do not hardcode the entire decision engine inside React components.

IMPORTANT SAFETY RULES

The app must never:

diagnose

prescribe medication

provide medication doses

recommend delaying emergency care

claim certainty about a disease

claim to replace a veterinarian

imply that “LOW CONCERN” means the pet is definitely healthy

Even the green result must say:

“No obvious urgent warning signs were identified from the information provided.”

Not:

“Your pet is healthy.”

The application only evaluates the information entered by the owner.

CONTENT QUALITY

Write all initial UI copy in natural, clear English.

Keep language understandable to ordinary pet owners.

Avoid excessive medical terminology.

When medical terminology is necessary, explain it in plain language.

Do not use fear-based copy.

Do not make every symptom sound like an emergency.

The goal is balanced navigation:

Reassure when appropriate.
Warn when appropriate.
Escalate when appropriate.

FINAL PRODUCT FEEL

The finished application should feel like a polished consumer health utility, not a demo.

The core user journey should be:

Open app
→ select pet
→ describe what changed
→ answer a few relevant questions
→ receive a clear navigation result
→ understand why
→ know what to monitor
→ save the result
→ optionally prepare a vet summary

The most important experience is the Health Checker.

Make it exceptionally clear, calm, fast, and easy to use.

Do not add unnecessary features that distract from this core experience.

Do not create an MVP or staged implementation.

Build the complete application described above in one coherent production-ready implementation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pet-watch-guide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2c7cdfa8-9f16-4880-af91-001c9e1f65c0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
