import type { Species } from "../types";

export interface RuleOption {
  id: string;
  label: string;
  /** 0 = reassuring, 1 = mild, 2 = notable, 3 = concerning */
  weight?: number;
  /** Marks an emergency-style answer. */
  urgent?: boolean;
  /** Plain-language sentence used in the "Why this result was shown" section. */
  reason?: string;
  /** When set, the option only applies to this species. */
  species?: Species;
}

export interface RuleQuestion {
  id: string;
  text: string;
  help?: string;
  type: "single" | "multi";
  options: RuleOption[];
}

export interface SymptomRule {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  questions: RuleQuestion[];
  monitor: string[];
  seekCareIf: string[];
}

const NONE = (id: string): RuleOption => ({ id, label: "None of these", weight: 0 });

const durationOptions: RuleOption[] = [
  { id: "lt6h", label: "Less than 6 hours ago", weight: 1 },
  { id: "today", label: "Today", weight: 1 },
  { id: "1-2d", label: "1–2 days ago", weight: 2, reason: "The change has lasted more than a day." },
  {
    id: "gt2d",
    label: "More than 2 days ago",
    weight: 3,
    reason: "The change has continued for more than two days.",
  },
];

const behaviourOptions: RuleOption[] = [
  { id: "normal", label: "Normal", weight: 0 },
  { id: "quieter", label: "Slightly quieter", weight: 1 },
  { id: "tired", label: "Very tired", weight: 3, reason: "Your pet seems very tired." },
  {
    id: "weak",
    label: "Extremely weak or difficult to wake",
    weight: 3,
    urgent: true,
    reason: "Extreme weakness or difficulty waking is a serious warning sign.",
  },
];

export const symptomRules: SymptomRule[] = [
  {
    id: "appetite",
    label: "Appetite",
    icon: "🍽",
    blurb: "Eating less, more, or refusing food",
    monitor: ["How much is eaten at each meal", "Water intake", "Energy level", "Body condition and weight"],
    seekCareIf: [
      "Your pet refuses all food for more than 24 hours (or 12 hours for a cat)",
      "Vomiting, diarrhoea or weakness develops",
      "Your pet also stops drinking",
    ],
    questions: [
      {
        id: "appetite.change",
        text: "How has your pet's eating changed?",
        type: "single",
        options: [
          { id: "slightly-less", label: "Eating a little less than usual", weight: 1 },
          { id: "much-less", label: "Eating much less than usual", weight: 2, reason: "Appetite is clearly reduced." },
          {
            id: "refusing",
            label: "Refusing food completely",
            weight: 3,
            reason: "Your pet is refusing food completely.",
          },
          { id: "more", label: "Eating noticeably more than usual", weight: 2, reason: "Appetite has clearly increased." },
        ],
      },
      { id: "appetite.duration", text: "When did this start?", type: "single", options: durationOptions },
      {
        id: "appetite.assoc",
        text: "Have you also noticed any of these?",
        type: "multi",
        options: [
          { id: "drinking-less", label: "Drinking less than usual", weight: 2, reason: "Water intake has dropped." },
          { id: "vomiting", label: "Vomiting", weight: 2, reason: "Vomiting is happening alongside the appetite change." },
          { id: "diarrhoea", label: "Diarrhoea", weight: 2 },
          { id: "low-energy", label: "Lower energy", weight: 2 },
          { id: "weight-loss", label: "Weight loss", weight: 2, reason: "Weight loss has been noticed as well." },
          NONE("appetite.assoc.none"),
        ],
      },
    ],
  },
  {
    id: "drinking",
    label: "Drinking",
    icon: "💧",
    blurb: "Drinking more or less than normal",
    monitor: ["How often the water bowl is refilled", "Urination frequency and volume", "Appetite", "Weight"],
    seekCareIf: [
      "Increased thirst continues for more than a few days",
      "Your pet cannot keep water down",
      "Your pet stops drinking altogether",
    ],
    questions: [
      {
        id: "drinking.change",
        text: "What have you noticed about drinking?",
        type: "single",
        options: [
          {
            id: "increased",
            label: "Noticeably drinking more",
            weight: 2,
            reason: "Thirst has clearly increased compared with normal.",
          },
          { id: "decreased", label: "Drinking less", weight: 2, reason: "Your pet is drinking less than usual." },
          {
            id: "not-drinking",
            label: "Not drinking at all",
            weight: 3,
            reason: "Your pet is not drinking at all.",
          },
        ],
      },
      { id: "drinking.duration", text: "When did this start?", type: "single", options: durationOptions },
      {
        id: "drinking.assoc",
        text: "Have you also noticed any of these?",
        type: "multi",
        options: [
          {
            id: "more-urination",
            label: "Urinating more often or larger amounts",
            weight: 2,
            reason: "Thirst and urination have both changed.",
          },
          { id: "appetite-change", label: "Appetite change", weight: 1 },
          { id: "weight-change", label: "Weight change", weight: 2 },
          { id: "low-energy", label: "Lower energy", weight: 2 },
          NONE("drinking.assoc.none"),
        ],
      },
    ],
  },
  {
    id: "vomiting",
    label: "Vomiting",
    icon: "🤢",
    blurb: "Bringing food or fluid back up",
    monitor: [
      "Vomiting frequency and timing",
      "Whether water stays down",
      "Appetite and energy",
      "Stool and urination",
    ],
    seekCareIf: [
      "Vomiting becomes repeated",
      "Your pet cannot keep water down",
      "Blood appears in the vomit",
      "Severe weakness, severe pain or a bloated abdomen develops",
    ],
    questions: [
      {
        id: "vomiting.frequency",
        text: "How often has your pet vomited?",
        type: "single",
        options: [
          { id: "once", label: "Once", weight: 1 },
          { id: "2-3", label: "2–3 times", weight: 2, reason: "Your pet has vomited more than once." },
          { id: "several", label: "Several times", weight: 3, reason: "Vomiting has happened several times." },
          {
            id: "repeated",
            label: "Repeatedly, and cannot keep food or water down",
            weight: 3,
            urgent: true,
            reason: "Repeated vomiting with an inability to keep water down can lead to rapid dehydration.",
          },
        ],
      },
      { id: "vomiting.duration", text: "When did it start?", type: "single", options: durationOptions },
      { id: "vomiting.behaviour", text: "How is your pet behaving?", type: "single", options: behaviourOptions },
      {
        id: "vomiting.flags",
        text: "Have you noticed any of these?",
        type: "multi",
        options: [
          { id: "blood", label: "Blood in the vomit", weight: 3, urgent: true, reason: "Blood in vomit was reported." },
          { id: "severe-pain", label: "Severe pain", weight: 3, urgent: true, reason: "Severe pain was reported." },
          {
            id: "bloated",
            label: "Bloated or swollen abdomen",
            weight: 3,
            urgent: true,
            reason: "A bloated or swollen abdomen was reported.",
          },
          {
            id: "breathing",
            label: "Difficulty breathing",
            weight: 3,
            urgent: true,
            reason: "Difficulty breathing was reported.",
          },
          { id: "collapse", label: "Collapse", weight: 3, urgent: true, reason: "Collapse was reported." },
          {
            id: "no-water",
            label: "Cannot keep water down",
            weight: 3,
            urgent: true,
            reason: "Your pet cannot keep water down.",
          },
          NONE("vomiting.flags.none"),
        ],
      },
    ],
  },
  {
    id: "diarrhoea",
    label: "Diarrhoea",
    icon: "💩",
    blurb: "Loose or watery stool",
    monitor: ["Number of loose stools per day", "Appearance and colour", "Water intake", "Energy and appetite"],
    seekCareIf: [
      "Diarrhoea continues beyond 48 hours",
      "Blood or a black, tarry appearance is seen",
      "Vomiting, weakness or severe abdominal discomfort develops",
    ],
    questions: [
      {
        id: "diarrhoea.frequency",
        text: "How often is your pet passing loose stool?",
        type: "single",
        options: [
          { id: "once", label: "Once or twice", weight: 1 },
          { id: "several", label: "Several times today", weight: 2, reason: "Loose stool is happening repeatedly." },
          {
            id: "constant",
            label: "Very frequently, almost continuously",
            weight: 3,
            reason: "Diarrhoea is very frequent.",
          },
        ],
      },
      { id: "diarrhoea.duration", text: "When did it start?", type: "single", options: durationOptions },
      {
        id: "diarrhoea.flags",
        text: "Have you noticed any of these?",
        type: "multi",
        options: [
          { id: "blood", label: "Fresh blood", weight: 3, reason: "Blood was seen in the stool." },
          {
            id: "black",
            label: "Black or tarry stool",
            weight: 3,
            urgent: true,
            reason: "Black or tarry stool can indicate digested blood.",
          },
          { id: "vomiting", label: "Vomiting as well", weight: 2, reason: "Vomiting is happening alongside diarrhoea." },
          { id: "not-drinking", label: "Not drinking", weight: 3, urgent: true, reason: "Your pet is not drinking." },
          { id: "no-appetite", label: "Not eating", weight: 2 },
          { id: "weak", label: "Weakness", weight: 3, reason: "Weakness was reported." },
          {
            id: "abdo-pain",
            label: "Severe abdominal discomfort",
            weight: 3,
            urgent: true,
            reason: "Severe abdominal discomfort was reported.",
          },
          NONE("diarrhoea.flags.none"),
        ],
      },
    ],
  },
  {
    id: "stool",
    label: "Stool changes",
    icon: "🧻",
    blurb: "Straining, constipation or unusual stool",
    monitor: ["How often stool is passed", "Straining or discomfort", "Appetite and drinking"],
    seekCareIf: [
      "No stool is passed for more than 48 hours with straining",
      "Blood appears",
      "Your pet seems painful or stops eating",
    ],
    questions: [
      {
        id: "stool.change",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "straining", label: "Straining to pass stool", weight: 2, reason: "Straining to pass stool was reported." },
          { id: "no-stool", label: "No stool for more than 2 days", weight: 3, reason: "No stool for more than two days." },
          { id: "blood", label: "Blood in the stool", weight: 3, reason: "Blood was seen in the stool." },
          { id: "mucus", label: "Mucus or slime", weight: 1 },
          { id: "worms", label: "Visible worms or segments", weight: 2 },
          { id: "colour", label: "Very pale or unusual colour", weight: 2 },
        ],
      },
      { id: "stool.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "urination",
    label: "Urination",
    icon: "🚽",
    blurb: "Changes in how or how often your pet urinates",
    monitor: ["Number of trips and amount produced", "Straining or vocalising", "Urine colour", "Litter box or toilet accidents"],
    seekCareIf: [
      "Your pet strains repeatedly without producing urine",
      "There is blood in the urine",
      "Your pet cries out or seems distressed while urinating",
    ],
    questions: [
      {
        id: "urination.change",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "more-often", label: "Urinating more often", weight: 2 },
          { id: "less-often", label: "Urinating less often", weight: 2 },
          {
            id: "straining",
            label: "Straining or difficulty urinating",
            weight: 3,
            reason: "Straining or difficulty urinating was reported.",
          },
          {
            id: "no-urine",
            label: "Repeated attempts but no urine produced",
            weight: 3,
            urgent: true,
            reason: "Repeated attempts to urinate without producing urine is an urgent warning sign.",
          },
          {
            id: "crying",
            label: "Crying or clear distress while urinating",
            weight: 3,
            reason: "Distress while urinating was reported.",
          },
          { id: "blood", label: "Blood in the urine", weight: 3, reason: "Blood in the urine was reported." },
          { id: "accidents", label: "Accidents outside the usual place", weight: 1 },
          {
            id: "licking",
            label: "Frequent licking of the genital area",
            weight: 2,
          },
        ],
      },
      { id: "urination.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "breathing",
    label: "Breathing",
    icon: "🫁",
    blurb: "Fast, noisy or laboured breathing",
    monitor: ["Breathing rate while resting", "Gum colour", "Effort needed to breathe", "Tolerance of gentle activity"],
    seekCareIf: [
      "Breathing becomes laboured or noisy at rest",
      "Gums look blue, grey or unusually pale",
      "Your pet sits with its neck stretched out or refuses to lie down",
    ],
    questions: [
      {
        id: "breathing.change",
        text: "What have you noticed about your pet's breathing?",
        type: "multi",
        options: [
          { id: "faster", label: "Faster than normal at rest", weight: 2, reason: "Resting breathing is faster than normal." },
          {
            id: "difficult",
            label: "Difficult or laboured breathing",
            weight: 3,
            urgent: true,
            reason: "Difficult or laboured breathing was reported.",
          },
          { id: "coughing", label: "Coughing", weight: 2 },
          {
            id: "open-mouth",
            label: "Open-mouth breathing",
            weight: 3,
            urgent: true,
            reason: "Open-mouth breathing was reported.",
          },
          { id: "sounds", label: "Unusual breathing sounds", weight: 2 },
          {
            id: "gums",
            label: "Blue, grey or very pale gums",
            weight: 3,
            urgent: true,
            reason: "Blue, grey or very pale gums were reported.",
          },
          { id: "collapse", label: "Collapse", weight: 3, urgent: true, reason: "Collapse was reported." },
        ],
      },
      { id: "breathing.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "coughing",
    label: "Coughing",
    icon: "😮‍💨",
    blurb: "A new or repeated cough",
    monitor: ["How often the cough happens", "Whether it is worse at night or after exercise", "Energy and appetite"],
    seekCareIf: ["The cough lasts more than a few days", "Breathing becomes difficult", "Your pet becomes tired quickly"],
    questions: [
      {
        id: "coughing.pattern",
        text: "How would you describe the cough?",
        type: "multi",
        options: [
          { id: "occasional", label: "Occasional", weight: 1 },
          { id: "frequent", label: "Frequent or repeated bouts", weight: 2, reason: "The cough is frequent." },
          { id: "night", label: "Worse at night or when lying down", weight: 2 },
          { id: "exercise", label: "Worse after exercise", weight: 2 },
          { id: "retching", label: "Ends in retching or gagging", weight: 2 },
          {
            id: "breathless",
            label: "With difficulty breathing",
            weight: 3,
            urgent: true,
            reason: "Coughing with difficulty breathing was reported.",
          },
        ],
      },
      { id: "coughing.duration", text: "When did it start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "sneezing",
    label: "Sneezing",
    icon: "🤧",
    blurb: "Sneezing or nasal discharge",
    monitor: ["Sneezing frequency", "Discharge colour", "Appetite and energy", "Eye involvement"],
    seekCareIf: ["Your pet stops eating", "Discharge becomes thick or bloody", "Breathing becomes noisy or difficult"],
    questions: [
      {
        id: "sneezing.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "occasional", label: "Occasional sneezing", weight: 0 },
          { id: "frequent", label: "Frequent sneezing", weight: 1 },
          { id: "clear", label: "Clear nasal discharge", weight: 1 },
          { id: "thick", label: "Thick or coloured discharge", weight: 2, reason: "Thick nasal discharge was reported." },
          { id: "blood", label: "Blood from the nose", weight: 3, reason: "Bleeding from the nose was reported." },
          { id: "eyes", label: "Runny or sore eyes as well", weight: 1 },
          { id: "not-eating", label: "Not eating", weight: 2, reason: "Your pet has stopped eating." },
        ],
      },
      { id: "sneezing.duration", text: "When did it start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "energy",
    label: "Energy / tiredness",
    icon: "🔋",
    blurb: "Less active or unusually tired",
    monitor: ["Willingness to move, play or walk", "Appetite and drinking", "Breathing at rest", "Gum colour"],
    seekCareIf: [
      "Your pet becomes very weak or wobbly",
      "Your pet is difficult to wake",
      "Tiredness appeared suddenly",
    ],
    questions: [
      {
        id: "energy.level",
        text: "How would you describe your pet's energy?",
        type: "single",
        options: [
          { id: "slightly-less", label: "Slightly less active", weight: 1 },
          { id: "noticeably", label: "Noticeably tired", weight: 2, reason: "Your pet is noticeably more tired than usual." },
          { id: "very-weak", label: "Very weak", weight: 3, urgent: true, reason: "Severe weakness was reported." },
          {
            id: "cannot-stand",
            label: "Unable to stand normally",
            weight: 3,
            urgent: true,
            reason: "Your pet is unable to stand normally.",
          },
          {
            id: "hard-to-wake",
            label: "Difficult to wake",
            weight: 3,
            urgent: true,
            reason: "Your pet is difficult to wake.",
          },
        ],
      },
      {
        id: "energy.onset",
        text: "How did the change appear?",
        type: "single",
        options: [
          { id: "sudden", label: "Suddenly", weight: 2, reason: "The change in energy came on suddenly." },
          { id: "gradual", label: "Gradually", weight: 1 },
        ],
      },
      { id: "energy.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "behavior",
    label: "Behaviour changes",
    icon: "🐾",
    blurb: "Hiding, restlessness or unusual reactions",
    monitor: ["Interaction with people and other pets", "Sleeping and hiding places", "Appetite", "Grooming habits"],
    seekCareIf: [
      "Your pet hides continuously and will not come out",
      "Behaviour changes suddenly and dramatically",
      "Confusion, circling or disorientation appears",
    ],
    questions: [
      {
        id: "behavior.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "hiding", label: "Hiding more than usual", weight: 2, reason: "Your pet is hiding more than usual." },
          { id: "clingy", label: "Unusually clingy", weight: 1 },
          { id: "restless", label: "Restless or unable to settle", weight: 2 },
          { id: "irritable", label: "Irritable or snappy when touched", weight: 2, reason: "Your pet reacts when touched." },
          { id: "vocal", label: "Vocalising more than usual", weight: 2 },
          { id: "grooming", label: "Grooming much less or much more", weight: 2 },
          {
            id: "disoriented",
            label: "Confused, circling or disoriented",
            weight: 3,
            urgent: true,
            reason: "Confusion or disorientation was reported.",
          },
        ],
      },
      { id: "behavior.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "pain",
    label: "Pain / discomfort",
    icon: "🩹",
    blurb: "Signs your pet may be uncomfortable",
    monitor: ["Posture and movement", "Reaction to being touched", "Appetite", "Restlessness at night"],
    seekCareIf: ["Pain seems severe", "Pain appears suddenly", "Your pet cannot settle or cries out"],
    questions: [
      {
        id: "pain.severity",
        text: "How uncomfortable does your pet seem?",
        type: "single",
        options: [
          { id: "mild", label: "Mild", weight: 1 },
          { id: "moderate", label: "Moderate", weight: 2, reason: "Moderate discomfort was reported." },
          {
            id: "severe",
            label: "Severe or uncontrolled",
            weight: 3,
            urgent: true,
            reason: "Severe or uncontrolled pain was reported.",
          },
        ],
      },
      {
        id: "pain.pattern",
        text: "What else have you noticed?",
        type: "multi",
        options: [
          { id: "sudden", label: "Came on suddenly", weight: 2, reason: "The discomfort came on suddenly." },
          { id: "persistent", label: "Persistent", weight: 2 },
          { id: "hiding", label: "Hiding", weight: 2 },
          { id: "vocalising", label: "Vocalising or crying out", weight: 2 },
          { id: "posture", label: "Unusual posture (hunched, stretched)", weight: 2, reason: "An unusual posture was reported." },
          { id: "moving", label: "Difficulty moving", weight: 2 },
        ],
      },
      { id: "pain.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "skin",
    label: "Skin / fur",
    icon: "🧴",
    blurb: "Itching, redness, hair loss or lumps",
    monitor: ["How often your pet scratches or licks", "Size and spread of affected areas", "Any discharge or smell"],
    seekCareIf: [
      "The skin is raw, bleeding or has an odour",
      "Swelling spreads quickly",
      "Your pet cannot rest because of itching",
    ],
    questions: [
      {
        id: "skin.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "itching", label: "Itching or scratching", weight: 1 },
          { id: "redness", label: "Redness", weight: 1 },
          { id: "hair-loss", label: "Hair loss", weight: 1 },
          { id: "wounds", label: "Wounds or raw areas", weight: 2, reason: "Wounds or raw skin were reported." },
          { id: "swelling", label: "Swelling or lumps", weight: 2 },
          { id: "discharge", label: "Discharge or smell", weight: 2 },
          {
            id: "sudden-widespread",
            label: "Sudden widespread reaction or facial swelling",
            weight: 3,
            urgent: true,
            reason: "A sudden widespread skin reaction or facial swelling was reported.",
          },
        ],
      },
      { id: "skin.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "eyes",
    label: "Eyes",
    icon: "👁",
    blurb: "Redness, discharge or squinting",
    monitor: ["Squinting or rubbing", "Discharge amount and colour", "Whether one or both eyes are affected"],
    seekCareIf: ["Your pet squints or holds an eye closed", "The eye looks cloudy or injured", "Vision seems affected"],
    questions: [
      {
        id: "eyes.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "redness", label: "Redness", weight: 1 },
          { id: "discharge", label: "Discharge", weight: 1 },
          { id: "squinting", label: "Squinting or holding the eye closed", weight: 3, reason: "Squinting was reported, which often means eye pain." },
          { id: "cloudy", label: "Cloudiness", weight: 2, reason: "Cloudiness of the eye was reported." },
          { id: "swelling", label: "Swelling around the eye", weight: 2 },
          { id: "injury", label: "Visible injury to the eye", weight: 3, urgent: true, reason: "An eye injury was reported." },
          { id: "vision", label: "Sudden change in vision", weight: 3, urgent: true, reason: "A sudden vision change was reported." },
        ],
      },
      { id: "eyes.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "ears",
    label: "Ears",
    icon: "👂",
    blurb: "Scratching, head shaking or discharge",
    monitor: ["Head shaking frequency", "Smell or discharge", "Sensitivity when touched"],
    seekCareIf: ["The ear is painful", "There is a strong odour or dark discharge", "Your pet tilts its head persistently"],
    questions: [
      {
        id: "ears.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "scratching", label: "Scratching at the ears", weight: 1 },
          { id: "shaking", label: "Head shaking", weight: 1 },
          { id: "odor", label: "Odour", weight: 2, reason: "An ear odour was reported." },
          { id: "discharge", label: "Discharge", weight: 2 },
          { id: "swelling", label: "Swelling of the ear flap", weight: 2 },
          { id: "pain", label: "Pain when touched", weight: 2, reason: "The ear seems painful." },
          { id: "head-tilt", label: "Persistent head tilt or loss of balance", weight: 3, reason: "A head tilt or balance problem was reported." },
        ],
      },
      { id: "ears.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "mouth",
    label: "Mouth / teeth",
    icon: "🦷",
    blurb: "Bad breath, drooling or trouble eating",
    monitor: ["Chewing on one side", "Drooling", "Breath odour", "Willingness to eat hard food"],
    seekCareIf: ["Your pet cannot eat", "There is bleeding from the mouth", "The face or jaw is swollen"],
    questions: [
      {
        id: "mouth.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "breath", label: "Bad breath", weight: 1 },
          { id: "drooling", label: "Drooling", weight: 2 },
          { id: "pawing", label: "Pawing at the mouth", weight: 2 },
          { id: "difficulty", label: "Difficulty eating or chewing", weight: 2, reason: "Difficulty eating or chewing was reported." },
          { id: "bleeding", label: "Bleeding from the mouth", weight: 3, reason: "Bleeding from the mouth was reported." },
          { id: "swelling", label: "Facial or jaw swelling", weight: 3, reason: "Facial or jaw swelling was reported." },
          { id: "pale-gums", label: "Very pale, blue or grey gums", weight: 3, urgent: true, reason: "Abnormal gum colour was reported." },
        ],
      },
      { id: "mouth.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "weight",
    label: "Weight changes",
    icon: "⚖️",
    blurb: "Losing or gaining weight",
    monitor: ["Body shape and ribs", "Appetite", "Drinking", "Energy"],
    seekCareIf: ["Weight loss continues", "Appetite drops as well", "Thirst increases at the same time"],
    questions: [
      {
        id: "weight.change",
        text: "What have you noticed?",
        type: "single",
        options: [
          { id: "loss-slow", label: "Gradual weight loss", weight: 2, reason: "Gradual weight loss was reported." },
          { id: "loss-fast", label: "Rapid weight loss", weight: 3, reason: "Rapid weight loss was reported." },
          { id: "gain", label: "Weight gain", weight: 1 },
        ],
      },
      {
        id: "weight.assoc",
        text: "Alongside the weight change, have you noticed any of these?",
        type: "multi",
        options: [
          { id: "appetite-up", label: "Eating more than usual", weight: 2 },
          { id: "appetite-down", label: "Eating less than usual", weight: 2 },
          { id: "thirst", label: "Drinking more than usual", weight: 2, reason: "Increased thirst accompanies the weight change." },
          { id: "vomiting", label: "Vomiting or diarrhoea", weight: 2 },
          NONE("weight.assoc.none"),
        ],
      },
    ],
  },
  {
    id: "mobility",
    label: "Walking / movement",
    icon: "🦴",
    blurb: "Limping or trouble moving",
    monitor: ["Which leg is affected", "Whether limping improves with rest", "Willingness to jump or climb stairs"],
    seekCareIf: [
      "Your pet cannot bear weight on a limb",
      "There was a fall, accident or injury",
      "Your pet cannot stand or walk",
    ],
    questions: [
      {
        id: "mobility.signs",
        text: "What have you noticed?",
        type: "multi",
        options: [
          { id: "limping", label: "Limping", weight: 2 },
          { id: "stand", label: "Difficulty standing", weight: 3, reason: "Difficulty standing was reported." },
          { id: "walk", label: "Difficulty walking", weight: 3, reason: "Difficulty walking was reported." },
          {
            id: "no-use",
            label: "Sudden inability to use a limb",
            weight: 3,
            urgent: true,
            reason: "A sudden inability to use a limb was reported.",
          },
          { id: "pain", label: "Obvious pain", weight: 2 },
          {
            id: "trauma",
            label: "Recent injury, fall or accident",
            weight: 3,
            urgent: true,
            reason: "A recent injury, fall or accident was reported.",
          },
        ],
      },
      { id: "mobility.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
  {
    id: "bleeding",
    label: "Bleeding",
    icon: "🩸",
    blurb: "Any visible bleeding",
    monitor: ["Whether bleeding has stopped", "The size of the wound", "Gum colour and alertness"],
    seekCareIf: [
      "Bleeding does not stop with gentle pressure",
      "The bleeding is heavy",
      "Your pet becomes weak, pale or collapses",
    ],
    questions: [
      {
        id: "bleeding.location",
        text: "Where is the bleeding?",
        type: "multi",
        options: [
          { id: "wound", label: "A wound on the body or leg", weight: 2 },
          { id: "nose", label: "Nose", weight: 3, reason: "Bleeding from the nose was reported." },
          { id: "mouth", label: "Mouth", weight: 3, reason: "Bleeding from the mouth was reported." },
          { id: "urine", label: "In urine", weight: 3 },
          { id: "stool", label: "In stool", weight: 3 },
          { id: "other", label: "Somewhere else", weight: 2 },
        ],
      },
      {
        id: "bleeding.amount",
        text: "How much bleeding is there?",
        type: "single",
        options: [
          { id: "small", label: "A small amount", weight: 2 },
          { id: "moderate", label: "A moderate amount", weight: 3, reason: "Moderate bleeding was reported." },
          { id: "heavy", label: "Heavy bleeding", weight: 3, urgent: true, reason: "Heavy bleeding was reported." },
        ],
      },
      {
        id: "bleeding.status",
        text: "Has the bleeding stopped?",
        type: "single",
        options: [
          { id: "stopped", label: "Yes, it has stopped", weight: 1 },
          {
            id: "continuing",
            label: "No, it is still bleeding",
            weight: 3,
            urgent: true,
            reason: "The bleeding has not stopped.",
          },
          { id: "unsure", label: "Not sure", weight: 2 },
        ],
      },
      {
        id: "bleeding.context",
        text: "Have you noticed any of these?",
        type: "multi",
        options: [
          { id: "trauma", label: "Injury, accident or trauma", weight: 3, urgent: true, reason: "Trauma was reported." },
          {
            id: "weak",
            label: "Weakness or collapse",
            weight: 3,
            urgent: true,
            reason: "Weakness or collapse alongside bleeding was reported.",
          },
          NONE("bleeding.context.none"),
        ],
      },
    ],
  },
  {
    id: "other",
    label: "Something else",
    icon: "❓",
    blurb: "Another change you have noticed",
    monitor: ["The change you noticed", "Appetite, drinking, energy and toileting", "Whether the change is spreading or worsening"],
    seekCareIf: ["The change persists or worsens", "Your pet seems unwell in themselves"],
    questions: [
      {
        id: "other.severity",
        text: "How concerning does the change seem to you?",
        type: "single",
        options: [
          { id: "mild", label: "Mild — my pet seems otherwise fine", weight: 1 },
          { id: "moderate", label: "Moderate — something is clearly different", weight: 2, reason: "You described a clear change from normal." },
          { id: "serious", label: "Serious — I am worried", weight: 3, reason: "You described the change as serious." },
        ],
      },
      { id: "other.duration", text: "When did this start?", type: "single", options: durationOptions },
    ],
  },
];

export const symptomById = (id: string) => symptomRules.find((s) => s.id === id);

/**
 * General context is asked in step 4 of every check. It is modelled as a
 * hidden symptom rule so the engine can score it like any other answers.
 */
export const GENERAL_CONTEXT_ID = "general";

export const generalContextRule: SymptomRule = {
  id: GENERAL_CONTEXT_ID,
  label: "General context",
  icon: "🧭",
  blurb: "How your pet seems overall",
  monitor: ["Overall energy, appetite and drinking", "Whether things improve or worsen over the next day"],
  seekCareIf: ["Your pet becomes much quieter, weaker or stops eating and drinking"],
  questions: [
    {
      id: "general.behaviour",
      text: "How is your pet behaving overall?",
      type: "single",
      options: behaviourOptions,
    },
    {
      id: "general.eating",
      text: "How is eating and drinking today?",
      type: "single",
      options: [
        { id: "normal", label: "Normal", weight: 0 },
        { id: "reduced", label: "A little reduced", weight: 1 },
        {
          id: "none",
          label: "Not eating or drinking at all",
          weight: 3,
          reason: "Your pet is not eating or drinking.",
        },
      ],
    },
    {
      id: "general.duration",
      text: "How long have you noticed something different?",
      type: "single",
      options: durationOptions,
    },
    {
      id: "general.risk",
      text: "Does any of this apply?",
      type: "multi",
      options: [
        { id: "very-young", label: "Very young (under 6 months)", weight: 2, reason: "Very young animals can become unwell quickly." },
        { id: "senior", label: "Senior pet", weight: 2, reason: "Older pets can deteriorate faster." },
        { id: "pregnant", label: "Pregnant or recently gave birth", weight: 2, reason: "Pregnancy or recent birth needs extra caution." },
        { id: "chronic", label: "Has a long-term health condition", weight: 2, reason: "An existing long-term condition needs extra caution." },
        { id: "medication", label: "Currently on medication", weight: 1 },
        NONE("general.risk.none"),
      ],
    },
  ],
};

symptomRules.push(generalContextRule);

/** Symptoms shown to the owner in the picker (general context is asked separately). */
export const selectableSymptoms = symptomRules.filter((s) => s.id !== GENERAL_CONTEXT_ID);
