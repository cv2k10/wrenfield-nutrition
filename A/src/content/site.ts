/**
 * Wrenfield Nutrition — all marketing copy and funnel content in one editable file.
 * Fictional business. No statistics, reviews, ratings or outcome claims are used anywhere.
 */

export const brand = {
  name: "Wrenfield Nutrition",
  shortName: "Wrenfield",
  tagline: "Nutrition coaching for life on a GLP-1",
  demoNotice: "Concept website: fictional business, sample content.",
  contact: {
    phone: "(555) 010-0142",
    email: "hello@wrenfield.example",
    location: "Video sessions only · Based in Portland, Oregon (sample)",
    hours: "Mon–Thu, 9:00am–5:00pm Eastern (sample hours)",
    responseTime: "We reply within two business days (sample).",
  },
  notMedical:
    "Wrenfield Nutrition is not a medical provider. We do not prescribe, adjust or advise on medication or dosing. Always talk with your prescriber about your medication and any symptoms. In an emergency, call 911.",
} as const;

export const navLinks = [
  { label: "Sound Familiar", href: "#sound-familiar" },
  { label: "Plate Check", href: "#plate-check" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Plans", href: "#plans" },
  { label: "Coach", href: "#coach" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  headline: "Your appetite changed. Your nutrition plan should too.",
  eyebrow: "One-to-one video nutrition coaching · Across the U.S.",
  supporting:
    "Wrenfield Nutrition helps adults on GLP-1 medications eat enough protein, handle side effects with ordinary food, protect their strength, and build food habits that stay with them if they ever stop. One coach, one plan, working alongside your prescriber.",
  secondaryCta: "Take the Plate Check (2 min)",
  trustCues: [
    "Works alongside your prescriber",
    "Clear pricing up front",
    "No supplements to buy",
  ],
  imageNote: "Eating less? Then every bite has to count.",
  imageCaption:
    "A balanced, protein-forward plate: salmon, vegetables and rice — enough protein to matter, enough food to feel good.",
} as const;

/* ---------------------------------------------------------------------------
   Sound familiar? concerns
--------------------------------------------------------------------------- */
export const concerns = [
  {
    id: "forget-eat",
    title: "I forget to eat, then feel awful",
    summary: "Appetite signals get quiet, so lunch quietly disappears.",
    why: [
      "GLP-1 medications slow digestion and soften hunger cues, so the usual 'I'm hungry' nudge can arrive late or not at all. It is easy to look up at 4pm and realize you have had coffee and three crackers.",
      "Running on empty often shows up as headache, shakiness, irritability, or a sudden wave of nausea — which can then make eating feel even less appealing.",
    ],
    tryThis: [
      "Anchor food to things you already do: protein at breakfast before your first meeting, and a snack with your afternoon medication or coffee.",
      "Keep one no-cook protein within arm's reach — cottage cheese, plain Greek yogurt, boiled eggs, edamame, tinned fish, or a glass of milk.",
      "Set a gentle phone alarm for 11:30am with a specific, small instruction: 'cheese + apple', not 'eat lunch'.",
    ],
    prescriber:
      "If you are going whole days without eating, feeling faint, or having trouble keeping fluids down, tell your prescriber. That is a medical conversation, not a food one.",
  },
  {
    id: "nausea",
    title: "Nausea makes most food unappealing",
    summary: "The smell, texture or thought of food turns you off.",
    why: [
      "Nausea and food aversions are common with these medications, especially in the days after a dose and when doses change. Strong smells, fatty or very sweet foods, and large portions can be the first things to go.",
      "When eating feels like a chore, the goal is not a perfect plate. It is finding the few foods that go down easily and repeating them.",
    ],
    tryThis: [
      "Try cool or room-temperature foods: yogurt, a smoothie, tofu, chilled chicken, cucumber, melon. They tend to smell less.",
      "Choose small and plain over big and flavorful: half a turkey sandwich now, the rest in an hour.",
      "Keep salty crackers or dry toast nearby for the first ten minutes of a rough morning, then add protein when you can.",
    ],
    prescriber:
      "Persistent nausea, vomiting, or trouble keeping fluids down deserves a call to your prescriber's office. Food choices can support you, but they do not replace medical care.",
  },
  {
    id: "weaker",
    title: "I'm losing weight but feel weaker",
    summary: "Clothes fit differently, but stairs and grocery bags feel heavier.",
    why: [
      "Fast weight loss can include muscle along with fat, particularly when protein is low and movement drops off. Smaller meals can make protein easy to undershoot without noticing.",
      "Strength is built from three ordinary things: enough protein across the day, some resistance work a couple of times a week, and enough total food to recover.",
    ],
    tryThis: [
      "Put a protein food at every eating occasion, including snacks — aim for a palm-sized portion rather than one big protein dinner.",
      "Try one strength session you can do at home: a chair sit-to-stand, a wall push-up, a slow carry of grocery bags across the kitchen.",
      "Eat something with protein and carbohydrate within a couple of hours of strength work, even if it is small.",
    ],
    prescriber:
      "New weakness, muscle pain, dizziness on standing, or unusual fatigue is worth mentioning to your prescriber promptly.",
  },
  {
    id: "stopping",
    title: "I'm worried about what happens when I stop",
    summary: "Medication may not be forever. Your kitchen habits can stay.",
    why: [
      "Appetite often returns when medication is reduced or stopped, and that surprise is one of the hardest parts. It is not a lack of willpower; it is physiology.",
      "We plan for it on purpose: familiar meals, protein at breakfast, a weekly cook-and-keep session, and a written plan for the first month after any change your prescriber makes.",
    ],
    tryThis: [
      "Pick three meals you already like and can cook on autopilot. Write them on a card for the fridge — that is your base, not a diet.",
      "Practice one protein-forward breakfast now, while appetite is low. Habits formed now are easier to keep later.",
      "Decide what your 'enough' looks like without a scale: energy, strength, and steady meals rather than counting every bite.",
    ],
    prescriber:
      "Any decision to taper or stop belongs to you and your prescriber. We can help with food around it, never with the medication plan itself.",
  },
] as const;

export type ConcernId = (typeof concerns)[number]["id"];

/* ---------------------------------------------------------------------------
   Plate Check assessment
--------------------------------------------------------------------------- */
export type MedicationStage =
  | "considering"
  | "just-started"
  | "steady"
  | "tapering-stopped";

export type QuizOption = {
  label: string;
  detail?: string;
  points: number;
  value?: MedicationStage;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  help?: string;
  areaLabel: string;
  scored: boolean;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "stage",
    prompt: "Where are you with a GLP-1 medication right now?",
    help: "Semaglutide or tirzepatide, prescribed by your own clinician. This sets the context — it is not scored.",
    areaLabel: "Where you are now",
    scored: false,
    options: [
      {
        label: "I'm considering one and want to get ahead of it",
        detail: "Reading, planning, or waiting for a prescription",
        points: 0,
        value: "considering",
      },
      {
        label: "Just starting",
        detail: "First three months, possibly still titrating",
        points: 0,
        value: "just-started",
      },
      {
        label: "On a steady dose",
        detail: "Settled in, still working on food",
        points: 0,
        value: "steady",
      },
      {
        label: "Tapering down or stopping with my prescriber",
        detail: "Includes anyone already off medication",
        points: 0,
        value: "tapering-stopped",
      },
    ],
  },
  {
    id: "meals",
    prompt: "On a normal day, how many times do you actually eat?",
    help: "Count anything with food in it, including a snack that stands in for a meal.",
    areaLabel: "Regular eating",
    scored: true,
    options: [
      { label: "Three meals, give or take a snack", points: 3 },
      { label: "Two proper meals", detail: "Usually breakfast and dinner", points: 2 },
      { label: "One meal, plus picking", detail: "Coffee and a few small things", points: 1 },
      { label: "Most days I skip meals", points: 0 },
    ],
  },
  {
    id: "protein",
    prompt: "How often does a meal include a clear protein food?",
    help: "Eggs, fish, poultry, meat, tofu, tempeh, Greek yogurt, cottage cheese, beans or lentils.",
    areaLabel: "Protein at meals",
    scored: true,
    options: [
      { label: "Nearly every meal", detail: "I know my usual protein foods", points: 3 },
      { label: "Once or twice a day", points: 2 },
      { label: "Mostly bread, crackers and fruit", detail: "Protein is hit or miss", points: 1 },
      { label: "I haven't really thought about it", points: 0 },
    ],
  },
  {
    id: "fluids",
    prompt: "How much do you drink in a day?",
    help: "Water, tea, broth and milk all count. Not a hydration prescription — just a snapshot.",
    areaLabel: "Fluids",
    scored: true,
    options: [
      { label: "Six or more cups, spread through the day", points: 3 },
      { label: "Three to five cups", points: 2 },
      { label: "One or two cups", points: 1 },
      { label: "I forget to drink most days", points: 0 },
    ],
  },
  {
    id: "fiber",
    prompt: "How often do vegetables or fruit show up on your plate?",
    help: "Frozen and pre-cut count. So does a handful of berries with your yogurt.",
    areaLabel: "Fiber and produce",
    scored: true,
    options: [
      { label: "Two or more times a day", points: 3 },
      { label: "About once a day", points: 2 },
      { label: "A few times a week", points: 1 },
      { label: "Rarely", points: 0 },
    ],
  },
  {
    id: "strength",
    prompt: "Any strength or resistance activity in a normal week?",
    help: "Home exercises, gym, bands, carrying, gardening — anything that loads your muscles.",
    areaLabel: "Strength activity",
    scored: true,
    options: [
      { label: "Two or three times a week", points: 3 },
      { label: "Once a week", points: 2 },
      { label: "Now and then", points: 1 },
      { label: "Not right now", points: 0 },
    ],
  },
  {
    id: "side-effects",
    prompt: "How much do side effects get in the way of eating?",
    help: "Nausea, constipation, reflux, food aversions, or early fullness.",
    areaLabel: "Eating around side effects",
    scored: true,
    options: [
      { label: "They don't, or rarely", points: 3 },
      { label: "Mild and manageable", points: 2 },
      { label: "Some days I eat very little", points: 1 },
      { label: "Most days are hard", points: 0 },
    ],
  },
];

export type PlanId = "fresh-start" | "steady-strength" | "taper-maintain";

export type QuizResultId = "build-base" | "fuel-strength" | "lock-in";

export type QuizResult = {
  id: QuizResultId;
  title: string;
  band: string;
  explanation: string;
  nextSteps: string[];
  planId: PlanId;
};

export const quizResults: QuizResult[] = [
  {
    id: "build-base",
    title: "Build the base",
    band: "0–44 out of 100",
    explanation:
      "Right now the basics need attention before anything clever: eating more often, getting protein into the meals you already have, and making food easy enough that a low-appetite day does not become a no-food day. That is a normal place to start, especially early on a medication or in a rough patch.",
    nextSteps: [
      "Choose two no-effort protein foods and put them where you will see them.",
      "Add one small eating occasion to your day this week — a mid-morning or mid-afternoon mini-meal.",
      "Write down the two side effects that most affect eating, and bring that list to your prescriber if they persist.",
    ],
    planId: "fresh-start",
  },
  {
    id: "fuel-strength",
    title: "Fuel the strength",
    band: "45–74 out of 100",
    explanation:
      "You have some good habits to build on. The work now is consistency: protein spread across the day, enough fluids, and strength activity that protects muscle while your weight changes. This is the most common place to land — steady, not broken.",
    nextSteps: [
      "Spread protein across three eating occasions instead of leaving it all to dinner.",
      "Pick a two-day-a-week strength slot that fits your actual calendar, not an ideal one.",
      "Build a five-meal rotation you can cook on low-energy days and repeat without thinking.",
    ],
    planId: "steady-strength",
  },
  {
    id: "lock-in",
    title: "Lock in for life",
    band: "75–100 out of 100",
    explanation:
      "Your day-to-day nutrition is in good shape. The useful work is protecting it: a plan for dose changes, travel and low-appetite weeks, plus a written routine that can carry you if medication is reduced or stopped. Strong foundations still benefit from a second set of eyes.",
    nextSteps: [
      "Write a one-page plan for the first month after any medication change your prescriber makes.",
      "Test your routine in a hard week — a work trip, an illness, a holiday — and adjust it before it breaks.",
      "Keep two strength sessions a week as a non-negotiable, even if they are short.",
    ],
    planId: "steady-strength",
  },
];

export type PlateCheckAnswers = Record<string, number>;

export type ScoredArea = {
  id: string;
  label: string;
  points: number;
  max: number;
  percent: number;
};

export type PlateCheckOutcome = {
  score: number;
  result: QuizResult;
  areas: ScoredArea[];
  weakest: ScoredArea[];
  stage: MedicationStage | null;
  planId: PlanId;
};

export function scorePlateCheck(answers: PlateCheckAnswers): PlateCheckOutcome {
  let earned = 0;
  let possible = 0;
  const areas: ScoredArea[] = [];

  for (const question of quizQuestions) {
    if (!question.scored) continue;
    const optionIndex = answers[question.id];
    const option =
      typeof optionIndex === "number" ? question.options[optionIndex] : undefined;
    const questionMax = Math.max(...question.options.map((o) => o.points));
    const points = option ? option.points : 0;
    earned += points;
    possible += questionMax;
    areas.push({
      id: question.id,
      label: question.areaLabel,
      points,
      max: questionMax,
      percent: Math.round((points / questionMax) * 100),
    });
  }

  const score = possible === 0 ? 0 : Math.round((earned / possible) * 100);
  const result =
    quizResults.find((r) =>
      r.id === "build-base" ? score <= 44 : r.id === "fuel-strength" ? score <= 74 : true,
    ) ?? quizResults[0];

  const stageOption = quizQuestions[0].options[answers["stage"] ?? -1];
  const stage = stageOption?.value ?? null;

  const weakest = [...areas].sort((a, b) => a.percent - b.percent).slice(0, 3);

  const planId: PlanId =
    stage === "tapering-stopped" ? "taper-maintain" : result.planId;

  return { score, result, areas, weakest, stage, planId };
}

/* ---------------------------------------------------------------------------
   What we don't do
--------------------------------------------------------------------------- */
export const redFlags = [
  {
    topic: "Medication or dosing advice",
    ours: "Never. We talk about food, and we ask you to take medication questions to your prescriber.",
    elsewhere: "Dose tweaks, 'booster' shots, or advice to skip or split doses.",
  },
  {
    topic: "Supplements and powders",
    ours: "Nothing to buy, ever. If a food-first option exists, we will find it.",
    elsewhere: "Protein powders, detox teas and 'must-have' add-ons sold at checkout.",
  },
  {
    topic: "Crash-calorie plans",
    ours: "Meals sized to a smaller appetite, with enough protein and enough food to function.",
    elsewhere: "800-calorie plans handed to people who are already barely eating.",
  },
  {
    topic: "Pounds-lost promises",
    ours: "We do not promise a number on the scale. We plan for habits, strength and steadier days.",
    elsewhere: "Guaranteed pounds lost, or a money-back challenge tied to the scale.",
  },
  {
    topic: "Before-and-after marketing",
    ours: "We will never use your photos, measurements or story as marketing.",
    elsewhere: "Before-and-after reels used as proof that a plan 'works'.",
  },
  {
    topic: "Pressure to pay on the call",
    ours: "The fit call is free. You leave with a written summary, and you can decide later.",
    elsewhere: "Sign today or lose your spot; card details taken mid-conversation.",
  },
] as const;

/* ---------------------------------------------------------------------------
   How it works
--------------------------------------------------------------------------- */
export const howItWorks = [
  {
    step: "01",
    title: "Free fit call",
    meta: "20 minutes · video or phone",
    body: "We ask what your days look like, what your prescriber has planned, and what food is already in your kitchen. If we are not the right fit, we say so and point you somewhere more useful.",
  },
  {
    step: "02",
    title: "Your plate plan",
    meta: "Written within 48 hours of your first session",
    body: "A one-page protein-first plate plan built from groceries you actually buy: breakfast through evening, snacks for low-appetite days, and what to do when a meal does not go down.",
  },
  {
    step: "03",
    title: "Weekly check-ins",
    meta: "30–40 minutes · messaging between",
    body: "We review the week, adjust portions, and solve one real problem at a time — the 4pm crash, the wedding buffet, the week you cannot face cooking. Short messages between sessions keep momentum without homework.",
  },
  {
    step: "04",
    title: "Strong-for-life habits",
    meta: "Ongoing · paced to your medication plan",
    body: "As your appetite and medication change, the plan changes with it. You leave with routines you can run on a bad week, so a taper or a stop is a food conversation you have already prepared for.",
  },
] as const;

/* ---------------------------------------------------------------------------
   Plans
--------------------------------------------------------------------------- */
export type Plan = {
  id: PlanId;
  name: string;
  badge?: string;
  duration: string;
  sessions: string;
  price: number;
  who: string;
  includes: string[];
  outline: { label: string; title: string; detail: string }[];
  leaveWith: string[];
  asksOfYou: string[];
  bestFor: string;
};

export const plans: Plan[] = [
  {
    id: "fresh-start",
    name: "Fresh Start",
    duration: "4 weeks",
    sessions: "3 sessions",
    price: 290,
    who: "For the first months on a GLP-1, or anyone whose eating has quietly fallen apart. Build a base you can keep.",
    includes: [
      "3 one-to-one video sessions (50 minutes)",
      "A written protein-first plate plan after session one",
      "A small-appetite meal and snack list",
      "One side-effect-friendly grocery list",
      "Session notes and next steps by email",
    ],
    outline: [
      {
        label: "Session 1 · Week 1",
        title: "Your kitchen, as it actually is",
        detail:
          "Your week, your appetite, your prescriber's plan and the food already in your kitchen. We agree on three meals and two snacks to try.",
      },
      {
        label: "Session 2 · Week 2",
        title: "Protein you will actually eat",
        detail:
          "Portion sizes for a smaller appetite, no-cook protein options, and what to do on days when food is unappealing.",
      },
      {
        label: "Session 3 · Week 4",
        title: "Keep the base going",
        detail:
          "We review what worked, fix what did not, and write your four-week maintenance routine and side-effect food notes.",
      },
    ],
    leaveWith: [
      "A one-page plate plan with real grocery items",
      "A snack list built for a small appetite",
      "A short list of food changes to discuss with your prescriber if symptoms persist",
    ],
    asksOfYou: [
      "About 20 minutes of food notes a week (photos are fine)",
      "One honest session about what you will not cook",
      "A 20-minute fit call before starting, so we both choose well",
    ],
    bestFor: "Starting out, resetting after a rough patch, or stopping the cycle of skipped meals.",
  },
  {
    id: "steady-strength",
    name: "Steady Strength",
    badge: "Our core program",
    duration: "12 weeks",
    sessions: "8 sessions + messaging",
    price: 890,
    who: "For people settled on a dose who want to protect muscle, steady their energy and stop re-solving the same meal every day.",
    includes: [
      "8 one-to-one video sessions (50 minutes)",
      "Messaging support between sessions (weekdays)",
      "A protein-first plate plan, revised as you go",
      "A side-effect-friendly grocery guide",
      "A 3-day-a-week strength starter routine for your doctor to review",
      "A written taper / stop preparation page, if relevant to you",
    ],
    outline: [
      {
        label: "Weeks 1–2",
        title: "Two sessions: the real baseline",
        detail:
          "We map your current meals, protein and energy, then build a plan around the food your household already eats.",
      },
      {
        label: "Weeks 3–6",
        title: "Two sessions: protein, fluids, produce",
        detail:
          "Spread protein across the day, add fluids and fiber gently, and test a five-meal rotation for low-energy weeks.",
      },
      {
        label: "Weeks 7–10",
        title: "Two sessions: strength and side effects",
        detail:
          "Add a twice-weekly resistance routine to discuss with your doctor, and food strategies for the days your medication makes eating hard.",
      },
      {
        label: "Weeks 11–12",
        title: "Two sessions: make it yours",
        detail:
          "We pressure-test the plan against travel, social meals and dose changes, then write your routine for the next 12 weeks.",
      },
    ],
    leaveWith: [
      "A current plate plan, updated at least once",
      "A five-meal rotation you can cook without a recipe",
      "A grocery guide organized by what your appetite tolerates",
      "A strength starter routine and a written taper preparation page",
    ],
    asksOfYou: [
      "One short food note most days (a photo or a sentence)",
      "Two 15-minute strength sessions a week once we agree on them",
      "Tell us when a week goes sideways — that is data, not failure",
    ],
    bestFor: "The long middle stretch: losing weight, keeping strength, and eating well on ordinary days.",
  },
  {
    id: "taper-maintain",
    name: "Taper & Maintain",
    duration: "8 weeks",
    sessions: "6 sessions",
    price: 590,
    who: "For people reducing or stopping medication with their prescriber, or already off it and finding appetite is back.",
    includes: [
      "6 one-to-one video sessions (50 minutes)",
      "A written taper and maintenance food plan",
      "A 'hunger is back' meal framework, not a calorie target",
      "A grocery and batch-cooking starter list",
      "A check-in message at weeks 2 and 6",
    ],
    outline: [
      {
        label: "Weeks 1–2",
        title: "Two sessions: what is changing",
        detail:
          "Your prescriber's taper plan, how appetite is shifting, and which meals need to become more substantial.",
      },
      {
        label: "Weeks 3–5",
        title: "Two sessions: hunger, protein, rhythm",
        detail:
          "Add volume and protein without relying on willpower; build breakfast and lunch defaults that survive returning hunger.",
      },
      {
        label: "Weeks 6–8",
        title: "Two sessions: maintenance in real life",
        detail:
          "We plan for weekends, eating out, stress and the scale wobble that follows, then write your ongoing routine.",
      },
    ],
    leaveWith: [
      "A written maintenance plate plan with portion anchors",
      "A 'hunger is back' framework that does not count every calorie",
      "A batch-cooking and freezer list for busy weeks",
    ],
    asksOfYou: [
      "A short weekly note on appetite and meals",
      "One cook-and-keep session a week, or a plan to buy your way around it",
      "Keep medication decisions strictly with your prescriber",
    ],
    bestFor: "Reducing or stopping medication, or preparing for a change your prescriber has already mentioned.",
  },
];

export const planComparison = {
  columns: plans.map((plan) => plan.name),
  rows: [
    { label: "Timeframe", values: { "fresh-start": "4 weeks", "steady-strength": "12 weeks", "taper-maintain": "8 weeks" } },
    { label: "Video sessions", values: { "fresh-start": "3", "steady-strength": "8", "taper-maintain": "6" } },
    { label: "Messaging between sessions", values: { "fresh-start": "—", "steady-strength": "Weekdays", "taper-maintain": "Two check-ins" } },
    { label: "Written plate plan", values: { "fresh-start": "Yes, after session 1", "steady-strength": "Yes, revised", "taper-maintain": "Yes, for maintenance" } },
    { label: "Small-appetite snack list", values: { "fresh-start": "Yes", "steady-strength": "Yes", "taper-maintain": "Yes" } },
    { label: "Side-effect grocery guide", values: { "fresh-start": "One list", "steady-strength": "Full guide", "taper-maintain": "Yes" } },
    { label: "Strength starter routine", values: { "fresh-start": "—", "steady-strength": "Yes", "taper-maintain": "Optional" } },
    { label: "Taper / stop food plan", values: { "fresh-start": "—", "steady-strength": "Yes, if relevant", "taper-maintain": "Core focus" } },
    { label: "Sample price", values: { "fresh-start": "$290", "steady-strength": "$890", "taper-maintain": "$590" } },
  ] as { label: string; values: Record<PlanId, string> }[],
} as const;

export const pricingNote = {
  sampleNotice: "All prices are sample prices for this concept website.",
  hsa: "Some clients ask whether nutrition coaching can be paid from an HSA or FSA. That is between you and your plan administrator; we make no promises and do not provide tax or benefits advice.",
  payment: "No payment is taken on the fit call. If you enroll, you receive a written agreement and an invoice first.",
} as const;

/* ---------------------------------------------------------------------------
   Kitchen toolkit deliverables
--------------------------------------------------------------------------- */
export const toolkit = [
  {
    icon: "plate" as const,
    title: "Your protein-first plate plan",
    format: "One page, written for your kitchen",
    body: "A breakfast, lunch, dinner and snack structure with protein anchors and portion sizes that suit a smaller appetite — built from groceries you already buy.",
  },
  {
    icon: "list" as const,
    title: "The 'small appetite' meal and snack list",
    format: "Fridge-ready list",
    body: "Twenty-odd low-effort combinations that work when food is unappealing: cottage cheese and peaches, egg on toast, tinned fish and crackers, yogurt with peanut butter.",
  },
  {
    icon: "basket" as const,
    title: "A side-effect-friendly grocery guide",
    format: "Organized by symptom",
    body: "A shopping list sorted by what tends to sit well when nausea, constipation or reflux shows up — with swaps, not supplements, and a note to raise persistent symptoms with your prescriber.",
  },
  {
    icon: "strength" as const,
    title: "3-day-a-week strength starter",
    format: "One page, for your doctor to review",
    body: "Simple chair, wall and bodyweight movements with clear starting points, designed to keep muscle while weight changes. Bring it to your prescriber before you start.",
  },
] as const;

/* ---------------------------------------------------------------------------
   Coach + promises
--------------------------------------------------------------------------- */
export const coach = {
  name: "Nora Alder",
  sampleProfile: "Sample profile — fictional coach",
  role: "Nutrition coach, Wrenfield Nutrition",
  paragraphs: [
    "I spent eleven years cooking in small community kitchens and teaching weeknight classes: how to roast a tray of vegetables, how to make one chicken last three meals, why a pot of beans is worth the freezer space.",
    "Then people in those classes started coming back with new questions. They were on semaglutide or tirzepatide, eating a fraction of what they used to, and quietly worried they were doing it wrong. Their care teams were managing the medication; nobody had time to sit with them and talk about eggs.",
    "That is the work I do now, over video, with the client's prescriber kept in the loop. I am not a doctor and I do not touch medication or dosing. I help people eat enough protein without forcing it, find food that goes down on a nausea day, keep some strength, and cook meals simple enough that they happen on a Tuesday.",
    "My bias is toward ordinary ingredients, a short rotation of meals, and plans that survive a bad week. If that sounds like the kind of support you have been missing, the fit call is the place to check whether we work well together.",
  ],
  caption:
    "Nora Alder, sample profile. This is a fictional coach, and the portrait is stock imagery, used for a concept website.",
  image: {
    src: "https://images.pexels.com/photos/7529486/pexels-photo-7529486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1240&w=992",
    alt: "A smiling woman in a warm kitchen holding a plate of sliced fresh vegetables, in soft daylight.",
    width: 992,
    height: 1240,
  },
} as const;

export const promises = [
  {
    title: "A written plate plan within 48 hours",
    body: "After your first paid session you get a real one-page plan by email — not a template with your name in the header.",
  },
  {
    title: "Food first, always",
    body: "No supplements, powders, shakes or affiliate links. If we cannot solve it with food, we say so.",
  },
  {
    title: "Your prescriber stays in charge",
    body: "We never advise on medication or dosing. With your permission we send a short nutrition summary to your care team.",
  },
  {
    title: "You can leave without friction",
    body: "Unused sessions are refundable, and rescheduling is free with 24 hours' notice. No retention scripts, no surprise renewals.",
  },
] as const;

/* ---------------------------------------------------------------------------
   FAQ
--------------------------------------------------------------------------- */
export const faqs = [
  {
    q: "Is this medical care?",
    a: [
      "No. Wrenfield Nutrition is nutrition coaching, not medical care, and we are not a medical provider. We do not diagnose or treat any condition, and we do not replace your prescriber, dietitian or care team.",
      "What we do is practical food support: meals that fit a smaller appetite, enough protein, side-effect-friendly choices, and habits you can keep. If something you describe needs medical attention, we will tell you to take it to your prescriber.",
    ],
  },
  {
    q: "Do you tell me how to change my dose?",
    a: [
      "No, and we will not guess. Medication choice, dose changes, tapering and stopping belong to you and your prescriber.",
      "If food is getting harder after a dose change, we work on the food side and encourage you to describe your symptoms to your prescriber's office. With your written permission, we can send them a short summary of what you are eating and how it is going.",
    ],
  },
  {
    q: "I'm not on a GLP-1 yet — can I still join?",
    a: [
      "Yes. Some clients come to us while considering medication, or while waiting for an appointment. Building protein-first meals and a cookable rotation now makes the first months on medication much easier.",
      "We will not tell you whether a medication is right for you. That is a conversation for your prescriber.",
    ],
  },
  {
    q: "Do I have to count calories or macros?",
    a: [
      "No. If counting helps you, we will use it. If it makes eating feel like admin, we use palm-sized protein portions, a regular eating rhythm and a short meal rotation instead.",
      "Either way, the plan is written down so you are not holding it all in your head.",
    ],
  },
  {
    q: "What if food makes me nauseous?",
    a: [
      "That is one of the most common things we work on. We start with foods that tend to be easier — cooler, plainer, smaller, more frequent — and build protein in at a level you can manage.",
      "We do not treat nausea. If it is persistent, severe, or you cannot keep fluids down, contact your prescriber promptly; that is a medical matter.",
    ],
  },
  {
    q: "Will I keep the weight off if I stop?",
    a: [
      "We cannot promise that, and we would be wary of anyone who does. Appetite often returns when medication stops, and long-term outcomes vary from person to person.",
      "What we can do is prepare the food side honestly: familiar meals, protein habits, a strength routine, and a written plan for the first month after your prescriber changes anything. Habits improve your odds; they are not a guarantee.",
    ],
  },
  {
    q: "Do I need special foods or supplements?",
    a: [
      "No. We build around ordinary groceries: eggs, yogurt, beans, tofu, tinned fish, chicken, frozen vegetables, fruit, bread, rice, olive oil. Convenience foods are allowed; so is a rotisserie chicken on a hard week.",
      "We do not sell supplements, powders or branded products, and we take no commission on anything you buy.",
    ],
  },
  {
    q: "What are the refund and rescheduling rules?",
    a: [
      "The fit call is free with no card required. If you enroll, you can cancel within 72 hours of your first session for a full refund, and any unused paid sessions are refundable on request.",
      "Rescheduling is free with 24 hours' notice. Missed sessions without notice count as used, which we will always confirm in writing when you enroll.",
    ],
  },
] as const;

/* ---------------------------------------------------------------------------
   Funnel options
--------------------------------------------------------------------------- */
export const medicationStages = [
  { value: "considering", label: "Considering a GLP-1", hint: "Reading, planning or waiting on an appointment" },
  { value: "just-started", label: "Just started", hint: "First three months" },
  { value: "steady", label: "On a steady dose", hint: "Settled in, still working on food" },
  { value: "tapering-stopped", label: "Tapering or stopped", hint: "With my prescriber" },
] as const;

export const concernOptions = [
  { value: "forget-eat", label: "I forget to eat, then feel awful" },
  { value: "nausea", label: "Nausea makes most food unappealing" },
  { value: "weaker", label: "I'm losing weight but feel weaker" },
  { value: "stopping", label: "I'm worried about what happens when I stop" },
  { value: "protein", label: "I want protein and meal ideas I will actually use" },
  { value: "side-effects", label: "Side effects are making eating hard" },
  { value: "unsure", label: "I'm not sure yet — I'd like to talk it through" },
] as const;

export const startTimelines = [
  { value: "this-week", label: "This week" },
  { value: "two-weeks", label: "In the next two weeks" },
  { value: "this-month", label: "Sometime this month" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

export const goalOptions = [
  "Eat enough protein without forcing it",
  "Feel better on my medication (fewer rough days)",
  "Keep muscle and strength while my weight changes",
  "Meals I can cook on low-energy days",
  "Prepare for tapering or stopping",
  "Stop thinking about food all day",
] as const;

export const eatingPreferences = [
  "No restrictions",
  "Vegetarian",
  "Vegan or mostly plant-based",
  "Pescatarian",
  "Gluten-free",
  "Dairy-free",
  "Several restrictions or allergies",
  "Prefer to discuss on the call",
] as const;

export const planInterestOptions = [
  { value: "steady-strength", label: "Steady Strength (12 weeks, sample $890)" },
  { value: "fresh-start", label: "Fresh Start (4 weeks, sample $290)" },
  { value: "taper-maintain", label: "Taper & Maintain (8 weeks, sample $590)" },
  { value: "unsure", label: "Not sure yet — recommend one" },
] as const;

export const usTimeZones = [
  "Eastern (ET)",
  "Central (CT)",
  "Mountain (MT)",
  "Arizona (MST, no DST)",
  "Pacific (PT)",
  "Alaska (AKT)",
  "Hawaii (HT)",
] as const;

export const preferredDays = [
  "Any weekday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const timeWindows = [
  "Morning (8–11am my time)",
  "Midday (11am–2pm my time)",
  "Afternoon (2–5pm my time)",
  "Evening (5–7pm my time)",
  "Any time that week",
] as const;

export const resourceStages = [
  "Considering a GLP-1",
  "Just started (first 3 months)",
  "On a steady dose",
  "Tapering or stopping with my prescriber",
  "Supporting someone else",
] as const;

export const bookingSteps = [
  "Where you are",
  "Your goals",
  "Contact and time",
  "Review",
] as const;

export const demoDisclaimer =
  "Demo only: this concept site does not send, submit or store your details.";

export const successDisclaimer = "Demo only: your request has not been sent.";
