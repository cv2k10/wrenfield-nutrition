/**
 * Wrenfield Nutrition — all site content lives here.
 * Concerns, Plate Check questions & scoring, plans, FAQs — edit freely.
 */

export const SITE = {
  name: "Wrenfield Nutrition",
  tagline: "Nutrition coaching for life on — and after — GLP-1 medication",
  phone: "(555) 010-0142",
  email: "hello@wrenfield.example",
  hours: "Mon–Thu, 9:00am–5:00pm ET · by video, anywhere in the U.S. (sample hours)",
  demoNotice: "Concept website: fictional business, sample content.",
};

/* ---------------------------------- Nav ---------------------------------- */

export const NAV_LINKS = [
  { href: "#sound-familiar", label: "Sound Familiar" },
  { href: "#plate-check", label: "Plate Check" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#plans", label: "Plans" },
  { href: "#coach", label: "Coach" },
  { href: "#faq", label: "FAQ" },
] as const;

/* ------------------------------ Sound familiar ---------------------------- */

export type ConcernId = "forget-to-eat" | "nausea" | "weaker" | "worried-stop";

export type Concern = {
  id: ConcernId;
  title: string;
  caption: string;
  why: string;
  tryThis: string;
};

export const CONCERN_REMINDER =
  "These are food and habit ideas only — never medication advice. If nausea, weakness, or any symptom worries you or sticks around, bring it to your prescriber.";

export const CONCERNS: Concern[] = [
  {
    id: "forget-to-eat",
    title: "I forget to eat, then feel awful",
    caption: "Long, foodless stretches followed by a crash.",
    why: "A smaller appetite can quiet hunger signals so much that meals simply slide off the day. Hours later, low energy, a headache, or a shaky, ravenous evening shows up instead — and the food you finally grab is whatever is fastest, not what keeps you strong.",
    tryThis:
      "Set two gentle meal alarms and put one protein-first snack where you can see it — a yogurt, a boiled egg, a handful of edamame. Eating by the clock is not a failure; it is a bridge while hunger is quiet.",
  },
  {
    id: "nausea",
    title: "Nausea makes most food unappealing",
    caption: "Nothing sounds good, and some smells make it worse.",
    why: "Slower digestion and stronger fullness signals can make rich, greasy, or big hot meals genuinely unappealing — especially in the days right after an injection. Smell sensitivity is common too, which quietly narrows what you can stand to eat.",
    tryThis:
      "Go small, cool, and simple: chilled or room-temperature protein (cottage cheese, sliced chicken, a mild smoothie) is often easier than a hot, heavy plate. Note which smells and textures trigger you, and keep two or three 'safe' foods stocked.",
  },
  {
    id: "weaker",
    title: "I'm losing weight but feel weaker",
    caption: "The number drops, but so does your strength.",
    why: "When total food drops fast, protein and resistance activity usually drop with it — and some of the weight lost can be muscle rather than fat. That shows up as heavy-feeling legs on stairs, a weaker grip, or workouts that suddenly feel much harder.",
    tryThis:
      "Anchor one meal a day with a palm-sized protein — eggs, fish, tofu, Greek yogurt, chicken — and add two short strength moments this week. Chair squats, wall push-ups, and carrying groceries all count.",
  },
  {
    id: "worried-stop",
    title: "I'm worried about what happens when I stop",
    caption: "You can feel appetite waiting in the wings.",
    why: "When the medication dose ends, appetite usually returns — sometimes quickly. The people who fare best after stopping are rarely the ones who ate the least; they are the ones who built a few durable eating and strength habits while the medication made practice easier.",
    tryThis:
      "Pick one 'keeper habit' this week — a protein-first breakfast, a ten-minute walk after dinner — and practice it as if the medication were already gone. What survives without the drug is what will carry you after it.",
  },
];

/* ------------------------------- Plate Check ------------------------------ */

export type StageValue = "just-starting" | "steady" | "tapering";

export type PlateOption = { value: string; label: string; hint?: string; points: number };

export type PlateQuestion = {
  id: string;
  scoredKey: string | null; // null = unscored context question
  areaLabel: string; // used in the weakest-areas chart
  question: string;
  options: PlateOption[];
};

export const PLATE_QUESTIONS: PlateQuestion[] = [
  {
    id: "stage",
    scoredKey: null,
    areaLabel: "Medication stage",
    question: "Where are you with your medication right now?",
    options: [
      { value: "just-starting", label: "Just starting", hint: "First weeks, or still adjusting dose", points: 0 },
      { value: "steady", label: "Steady", hint: "Settled on a stable dose", points: 0 },
      { value: "tapering", label: "Tapering or stopped", hint: "Reducing or off it, with my prescriber", points: 0 },
    ],
  },
  {
    id: "meals",
    scoredKey: "meals",
    areaLabel: "Regular meals",
    question: "On most days, how many real meals do you eat?",
    options: [
      { value: "one-or-less", label: "One, sometimes less", hint: "I often forget entirely", points: 0 },
      { value: "two-gaps", label: "Two, with long gaps", hint: "The pattern changes daily", points: 1 },
      { value: "two-three", label: "Two to three, fairly regular", hint: "Roughly the same times", points: 2 },
      { value: "three-steady", label: "Three steady meals", hint: "Or a planned rhythm that works", points: 3 },
    ],
  },
  {
    id: "protein",
    scoredKey: "protein",
    areaLabel: "Protein at meals",
    question: "How often does a clear protein anchor your plate?",
    options: [
      { value: "rarely", label: "Rarely", hint: "I eat whatever is easiest", points: 0 },
      { value: "one-meal", label: "One meal most days", hint: "Dinner usually has it", points: 1 },
      { value: "two-meals", label: "Two meals most days", hint: "Working on the third", points: 2 },
      { value: "nearly-every", label: "Nearly every meal", hint: "Eggs, fish, tofu, yogurt — always something", points: 3 },
    ],
  },
  {
    id: "fluids",
    scoredKey: "fluids",
    areaLabel: "Fluids",
    question: "How are your fluids lately?",
    options: [
      { value: "forget", label: "I often forget to drink", hint: "Evening arrives and the glass is full", points: 0 },
      { value: "few-glasses", label: "A few glasses, on a good day", points: 1 },
      { value: "sip-most-days", label: "I sip through most days", points: 2 },
      { value: "automatic", label: "Steady sipping is automatic", hint: "The bottle lives next to me", points: 3 },
    ],
  },
  {
    id: "fiber",
    scoredKey: "fiber",
    areaLabel: "Fiber & vegetables",
    question: "How do vegetables, fruit, or other fiber show up in your day?",
    options: [
      { value: "rarely", label: "Rarely", hint: "My stomach currently prefers beige", points: 0 },
      { value: "token", label: "A token serving some days", points: 1 },
      { value: "one-two", label: "One or two servings most days", points: 2 },
      { value: "most-meals", label: "They show up at most meals", hint: "Cooked, raw, frozen — all count", points: 3 },
    ],
  },
  {
    id: "strength",
    scoredKey: "strength",
    areaLabel: "Strength work",
    question: "Is there any strength or resistance activity in your week?",
    options: [
      { value: "none", label: "None right now", points: 0 },
      { value: "occasional", label: "Occasionally, no routine", points: 1 },
      { value: "once-twice", label: "Once or twice a week", points: 2 },
      { value: "two-plus", label: "Two or more planned sessions", hint: "Any cleared activity counts", points: 3 },
    ],
  },
  {
    id: "side-effects",
    scoredKey: "sideEffects",
    areaLabel: "Side-effect coping",
    question: "How much do side effects steer your eating?",
    options: [
      { value: "a-lot", label: "A lot", hint: "Nausea or fullness decide for me", points: 0 },
      { value: "bend-days", label: "They bend most days a little", points: 1 },
      { value: "occasionally", label: "Occasionally — I have workarounds", points: 2 },
      { value: "rarely", label: "Rarely or never", points: 3 },
    ],
  },
];

export type PlateTierId = "build-base" | "fuel-strength" | "lock-in";

export type PlateTier = {
  id: PlateTierId;
  name: string;
  headline: string;
  explanation: string;
  nextSteps: string[];
  planId: PlanId;
};

export const PLATE_TIERS: Record<PlateTierId, PlateTier> = {
  "build-base": {
    id: "build-base",
    name: "Build the base",
    headline: "Small appetite is crowding out the basics.",
    explanation:
      "Right now, eating less is also meaning eating less of what keeps you well — meals are irregular, and protein, fluids, or strength work are slipping. That is exactly what medication quiet does, and it is fixable with structure, not willpower. A short, focused reset beats a complicated plan.",
    nextSteps: [
      "Anchor two daily meal times and protect them like appointments — small and protein-first beats big and rare.",
      "Pick three low-effort proteins you never have to think about (rotisserie chicken, Greek yogurt, frozen edamame) and restock them weekly.",
      "Sip fluids on a timer for one week — a glass within an hour of waking, then steady small sips.",
    ],
    planId: "fresh-start",
  },
  "fuel-strength": {
    id: "fuel-strength",
    name: "Fuel the strength",
    headline: "The basics are in — now protect the muscle.",
    explanation:
      "You have a working rhythm, and now the meaningful gains are in the details: protein at nearly every eating occasion, fiber that your digestion tolerates, and regular resistance work so the weight you lose comes from fat, not strength. This is the phase where coaching pays for itself in kept muscle.",
    nextSteps: [
      "Push protein to every meal and snack — anchor first, then add plants and carbs around it.",
      "Schedule two strength sessions on your calendar this week, however short, and treat them as part of the prescription of eating well (cleared with your doctor first).",
      "Write your side-effect fallback menu: three gentle meals for rough days, shopped for in advance.",
    ],
    planId: "steady-strength",
  },
  "lock-in": {
    id: "lock-in",
    name: "Lock in for life",
    headline: "Strong habits — time to make them durable.",
    explanation:
      "Your plate is doing real work for you. The next job is durability: practicing these habits so they hold on vacation, in stressful weeks, and — if you ever taper with your prescriber — when appetite returns. What you rehearse now is what you keep later.",
    nextSteps: [
      "Name your three keeper habits and write them down — the ones you would keep even without the medication.",
      "Once a month, run a full 'off-medication week': practice your routine as if appetite were back, and note what wobbles.",
      "Set a maintenance check-in rhythm with yourself — a monthly plate-and-strength review on the calendar.",
    ],
    planId: "steady-strength",
  },
};

export const PLATE_DISCLAIMER =
  "The Plate Check is a self-reflection tool. It is not medical advice, a diagnosis, or a measure of health — just a snapshot to start a conversation.";

/* ---------------------------------- Steps --------------------------------- */

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Free fit call",
    text: "Fifteen to twenty minutes by video. We map what is happening with your eating, you ask us anything, and we are honest about whether coaching fits. No payment pressure — ever.",
  },
  {
    step: 2,
    title: "Your plate plan",
    text: "Within 48 hours of your first session you get a written, personal plate plan: protein anchors sized for your appetite, built from food you already like and can actually buy.",
  },
  {
    step: 3,
    title: "Weekly check-ins",
    text: "Short video sessions and brief between-session notes. Rough side-effect week? We adjust the food strategy around it. Life happens; the plan bends, it does not break.",
  },
  {
    step: 4,
    title: "Strong-for-life habits",
    text: "We rehearse maintenance before you need it — including practice weeks as if you were off the medication — so the habits hold whether you stay on, taper, or stop with your prescriber.",
  },
] as const;

/* ----------------------------- What we don't do --------------------------- */

export const HONESTY_ROWS = [
  {
    never: "Medication or dosing advice",
    detail: "Your dose is your prescriber's lane. We will never touch it.",
    redFlag: "Coaches casually suggesting you split doses or 'just skip a week'",
  },
  {
    never: "Supplement or powder upsells",
    detail: "We sell coaching, nothing else. There is no product shelf here.",
    redFlag: "'Required' shake bundles, detox teas, or a coach's affiliate storefront",
  },
  {
    never: "800-calorie crash plans",
    detail: "Smaller appetite is not a license to starve. We protect protein and strength.",
    redFlag: "Starvation targets that treat muscle loss as a rounding error",
  },
  {
    never: "Guaranteed pounds-lost promises",
    detail: "Bodies vary. We promise structure and attention, not a number.",
    redFlag: "'Lose 30 pounds or your money back' marketing math",
  },
  {
    never: "Before/after photo marketing",
    detail: "No photo reels, no dramatic transformations, no borrowed bodies.",
    redFlag: "Transformation galleries with lighting doing more work than coaching",
  },
  {
    never: "Pressure to pay on the first call",
    detail: "The fit call is free and genuinely optional to act on. Sleep on it.",
    redFlag: "'This discount expires tonight' countdown tactics",
  },
] as const;

/* ---------------------------------- Plans --------------------------------- */

export type PlanId = "fresh-start" | "steady-strength" | "taper-maintain";

export type Plan = {
  id: PlanId;
  name: string;
  badge?: string;
  length: string;
  sessions: string;
  price: string;
  audience: string;
  summary: string;
  includes: { label: string; included: boolean }[]; // comparison rows
  outline: { when: string; title: string; text: string }[];
  leaveWith: string[];
  asksOfYou: string[];
};

export const PLANS: Plan[] = [
  {
    id: "fresh-start",
    name: "Fresh Start",
    length: "4 weeks",
    sessions: "3 sessions",
    price: "$290",
    audience: "For your first weeks on a GLP-1 — or while you are still deciding with your prescriber.",
    summary: "A short, calm reset: regular small meals, protein anchors, and a side-effect food playbook.",
    includes: [
      { label: "Live video sessions", included: true },
      { label: "Personal protein-first plate plan", included: true },
      { label: "\u201cSmall appetite\u201d meal & snack list", included: true },
      { label: "Side-effect-friendly grocery guide", included: true },
      { label: "Between-session messaging", included: false },
      { label: "Strength starter routine", included: false },
      { label: "Maintenance rehearsal week", included: false },
    ],
    outline: [
      {
        when: "Week 1",
        title: "Baseline & first plate plan",
        text: "What you are actually eating now, what your appetite does across the week, and your first protein-first plate plan — written up for you within 48 hours.",
      },
      {
        when: "Week 2",
        title: "Protein & fluids tune-up",
        text: "We adjust anchors to what you genuinely ate, build your small-appetite snack list, and set a fluid routine your stomach tolerates.",
      },
      {
        when: "Week 4",
        title: "Side-effect playbook & wrap",
        text: "Gentle fallback meals for rough days, a grocery loop that keeps safe foods stocked, and your keep-it-going checklist for after the program.",
      },
    ],
    leaveWith: [
      "A written, personal protein-first plate plan",
      "A small-appetite meal and snack list matched to your tastes",
      "A side-effect-friendly grocery guide for rough weeks",
    ],
    asksOfYou: [
      "Roughly 20 minutes a day of practice — this is cooking-light by design",
      "Honest, quick weekly check-in notes (five minutes, no essays)",
      "Willingness to bring symptom questions back to your prescriber",
    ],
  },
  {
    id: "steady-strength",
    name: "Steady Strength",
    badge: "Our core program",
    length: "12 weeks",
    sessions: "8 sessions + messaging",
    price: "$890",
    audience: "For a steady season on medication: protect muscle, eat well on small appetite, build durable habits.",
    summary: "The full coaching arc — plate, strength support, real-life eating, and a maintenance blueprint.",
    includes: [
      { label: "Live video sessions", included: true },
      { label: "Personal protein-first plate plan", included: true },
      { label: "\u201cSmall appetite\u201d meal & snack list", included: true },
      { label: "Side-effect-friendly grocery guide", included: true },
      { label: "Between-session messaging", included: true },
      { label: "Strength starter routine", included: true },
      { label: "Maintenance rehearsal week", included: true },
    ],
    outline: [
      {
        when: "Session 1 · Week 1",
        title: "Map & plate plan",
        text: "Your appetite map, current plate audit, and the first version of your personal protein-first plan.",
      },
      {
        when: "Session 2 · Week 2",
        title: "Protein anchors",
        text: "Protein at every eating occasion, sized to your appetite — including plant-based paths if that is how you eat.",
      },
      {
        when: "Session 3 · Week 4",
        title: "Fluids & fiber without the bloat",
        text: "Hydration rhythm plus tolerated fiber upgrades, sequenced so your digestion keeps up.",
      },
      {
        when: "Session 4 · Week 5",
        title: "Snack systems & the grocery loop",
        text: "Your small-appetite snack list, a two-loop grocery routine, and backup foods that never expire on you.",
      },
      {
        when: "Session 5 · Week 7",
        title: "Strength fueling",
        text: "Eating to support your strength starter routine — timed protein, pre- and post-session bites (routine itself cleared with your doctor first).",
      },
      {
        when: "Session 6 · Week 8",
        title: "Restaurants, travel & holidays",
        text: "Menus, airports, and family tables: ordering protein-first anywhere without becoming the difficult guest.",
      },
      {
        when: "Session 7 · Week 10",
        title: "Appetite swings & plateaus",
        text: "When appetite surges back for a week or the scale stalls: what is normal, what is noise, and how to adjust food without panic.",
      },
      {
        when: "Session 8 · Week 12",
        title: "Maintenance blueprint",
        text: "Your keeper habits, a maintenance rehearsal week, and a 90-day map for whatever comes next — staying on, tapering, or pausing with your prescriber.",
      },
    ],
    leaveWith: [
      "Your complete plate plan, revised across the program",
      "Snack list, grocery loops, and a side-effect fallback menu",
      "A 3-day-a-week strength starter routine to discuss with your doctor",
      "A written 90-day maintenance blueprint",
    ],
    asksOfYou: [
      "Eight sessions over twelve weeks — about an hour a week total",
      "Brief between-session notes when you use messaging",
      "Two short strength sessions most weeks (cleared with your doctor)",
    ],
  },
  {
    id: "taper-maintain",
    name: "Taper & Maintain",
    length: "8 weeks",
    sessions: "6 sessions",
    price: "$590",
    audience: "For people reducing or stopping medication with their prescriber — and wanting a landing plan.",
    summary: "Practice for returning appetite: portions, protein locks, and a rehearsed maintenance routine.",
    includes: [
      { label: "Live video sessions", included: true },
      { label: "Personal protein-first plate plan", included: true },
      { label: "\u201cSmall appetite\u201d meal & snack list", included: true },
      { label: "Side-effect-friendly grocery guide", included: false },
      { label: "Between-session messaging", included: true },
      { label: "Strength starter routine", included: true },
      { label: "Maintenance rehearsal week", included: true },
    ],
    outline: [
      {
        when: "Week 1",
        title: "Keeper-habit audit",
        text: "Which of your current habits would survive a full appetite return — and which only exist because the medication does. We reinforce the keepers first.",
      },
      {
        when: "Week 2",
        title: "Return-of-appetite playbook",
        text: "A written plan for the first hungry weeks: what changes on your plate, what stays fixed, and how you will notice drift early.",
      },
      {
        when: "Week 3",
        title: "Fullness recalibration",
        text: "Relearning portions as fullness signals shift — plate layouts that satisfy without relying on medication-quiet.",
      },
      {
        when: "Week 4",
        title: "Snacks & cravings navigation",
        text: "Protein-forward snack architecture for real cravings, plus routines for evenings and weekends.",
      },
      {
        when: "Week 6",
        title: "Strength & protein lock-in",
        text: "Your strength starter routine becomes standing infrastructure, with protein timing to match.",
      },
      {
        when: "Week 8",
        title: "90-day maintenance map",
        text: "A rehearsal week as if medication were already done, then your written three-month map: meals, movement, and early-warning signals.",
      },
    ],
    leaveWith: [
      "A return-of-appetite playbook written in your words",
      "Recalibrated plate and portion layouts for post-medication eating",
      "A strength routine to keep (cleared with your doctor)",
      "A 90-day map with early-warning signals and check-in dates",
    ],
    asksOfYou: [
      "Work with your prescriber on the taper itself — we never touch dosing",
      "Practice weeks where you behave as if appetite has already returned",
      "Honesty about fear of regain — it is common, and we plan around it",
    ],
  },
];

export const HSA_NOTE =
  "Some clients ask their plan administrator whether nutrition counseling qualifies for HSA or FSA funds. Rules vary by plan, and we can provide receipts — but we cannot promise eligibility.";

/* --------------------------------- Toolkit -------------------------------- */

export const TOOLKIT = [
  {
    id: "plate-plan",
    title: "A personal protein-first plate plan",
    text: "One page, your foods, your portions — built in your first session and revised as your appetite changes. Not a template with your name on it.",
  },
  {
    id: "snack-list",
    title: "\u201cSmall appetite\u201d meal & snack list",
    text: "Twenty-plus combinations sized for tiny appetites, with five-minute and no-cook options for low-energy days.",
  },
  {
    id: "grocery-guide",
    title: "Side-effect-friendly grocery guide",
    text: "Aisle-by-aisle picks for nausea-prone, fullness-fast, and everything-sounds-beige weeks — normal food from normal stores.",
  },
  {
    id: "strength-starter",
    title: "3-day-a-week strength starter",
    text: "A simple at-home routine to take to your doctor and clear first — built to protect the muscle your weight loss can otherwise carry away.",
  },
] as const;

/* ---------------------------------- Coach --------------------------------- */

export const COACH = {
  name: "Maren Hollis",
  label: "Sample profile — an illustrative fictional coach",
  story: [
    "Maren spent a decade teaching weeknight cooking classes out of a community kitchen — the kind where you learn three dinners you will actually make again. When several regulars started GLP-1 medications and quietly stopped eating half of what she taught, she noticed something: nobody was helping them eat less, well.",
    "She began coaching clients one-to-one alongside their prescribers and dietitians — always in her own lane, never in the medication lane. Her kitchen rule hasn't changed since the classes: small appetite, big nutrition, and food you can buy at an ordinary grocery store.",
  ],
  note: "Maren is a fictional persona for this concept website. A real practice would introduce its actual coach here — with real credentials.",
};

export const PROMISES = [
  {
    title: "A written plate plan in 48 hours",
    text: "Within two days of your first session you hold a real, personal plan — not a recap email.",
  },
  {
    title: "Replies within two business days",
    text: "Message your coach between sessions (Steady Strength and Taper & Maintain) and hear back fast.",
  },
  {
    title: "No products, ever",
    text: "No supplements, powders, shakes, or affiliate links. Our only product is coaching.",
  },
  {
    title: "Honest referrals out",
    text: "If something you need is beyond coaching scope, we say so plainly and point you to the right clinician.",
  },
] as const;

/* ----------------------------------- FAQ ---------------------------------- */

export const FAQS = [
  {
    q: "Is this medical care?",
    a: "No. Wrenfield provides nutrition coaching — practical help with food, meals, and habits. It is not medical care, medical nutrition therapy, or a substitute for your prescriber, physician, or registered dietitian. We work alongside your care team, and anything medical routes straight back to them.",
  },
  {
    q: "Will you tell me how to change my dose?",
    a: "Never. Dosing, titration, switching, pausing, or stopping medication is exclusively a conversation between you and your prescriber. Our lane is food: what to eat, how to handle side-effect days with food choices, and how to build habits. If a dosing question comes up in a session, we will ask you to bring it to your prescriber.",
  },
  {
    q: "I'm not on a GLP-1 yet — can I still join?",
    a: "Yes. If you and your prescriber are considering medication, this is a genuinely good moment to build protein, strength, and meal-structure habits — they make the first medication weeks much easier. What we will never do is advise you on whether to start a medication. That decision belongs to you and your prescriber.",
  },
  {
    q: "Do I have to count calories or macros?",
    a: "No. Our default approach is plate anchors and routines, not logging. If you personally like tracking and find it calming rather than stressful, we can work with your numbers — but counting is a tool, never a requirement, and plenty of clients never open a tracking app.",
  },
  {
    q: "What if food makes me nauseous?",
    a: "We build food-first workarounds: smaller, cooler, simpler meals; timing strategies around your injection day; and fallback menus stocked in advance. But nausea that is new, severe, or persistent is a symptom for your prescriber, not a meal-planning problem — we will always say so.",
  },
  {
    q: "Will I keep the weight off if I stop?",
    a: "Honestly, no one can promise you that — including us. Weight regain after stopping these medications is common, which is exactly why we practice maintenance before you need it: protein habits, strength work, and routines rehearsed as if appetite had already returned. We build your best footing; we do not guarantee an outcome.",
  },
  {
    q: "Do I need special foods or supplements?",
    a: "No. Everything we plan uses ordinary grocery-store food you already like. We sell no supplements, shakes, or powders, and we have no affiliate store. If your own clinician has recommended something specific, we will help you fit it into meals you enjoy.",
  },
  {
    q: "What are your refund and rescheduling rules?",
    a: "Sample policy for this demo site: the fit call is always free; reschedule any session with 24 hours' notice at no charge; and unused sessions are refundable at any time, prorated to the session. Coaching should earn your trust monthly, not lock it in on day one.",
  },
] as const;

/* ------------------------------ Booking funnel ----------------------------- */

export const FUNNEL_OPTIONS = {
  stages: [
    { value: "considering", label: "Considering, not started yet" },
    { value: "just-started", label: "Just started (first weeks)" },
    { value: "steady", label: "Steady on a stable dose" },
    { value: "tapering", label: "Tapering or stopped, with my prescriber" },
  ],
  concerns: [
    { value: "forget-to-eat", label: "I forget to eat, then feel awful" },
    { value: "nausea", label: "Nausea makes most food unappealing" },
    { value: "weaker", label: "I'm losing weight but feel weaker" },
    { value: "worried-stop", label: "I'm worried about what happens when I stop" },
    { value: "general", label: "Something else / general questions" },
  ],
  soon: [
    { value: "two-weeks", label: "Within two weeks" },
    { value: "month", label: "Within a month or so" },
    { value: "exploring", label: "Just exploring for now" },
  ],
  goals: [
    { value: "protein", label: "Eat enough protein on a small appetite" },
    { value: "side-effects", label: "Handle nausea & side effects with food" },
    { value: "strength", label: "Protect strength and muscle" },
    { value: "after", label: "Build habits that survive stopping" },
    { value: "simplify", label: "Simplify meals and grocery runs" },
    { value: "other", label: "Something else" },
  ],
  preferences: [
    { value: "none", label: "No particular restrictions" },
    { value: "vegetarian", label: "Vegetarian" },
    { value: "pescatarian", label: "Pescatarian" },
    { value: "dairy-free", label: "Dairy-free" },
    { value: "gluten-free", label: "Gluten-free" },
    { value: "low-fodmap", label: "Low-FODMAP / sensitive stomach" },
    { value: "other", label: "Other — I'll explain" },
  ],
  timeZones: [
    { value: "ET", label: "Eastern Time (ET)" },
    { value: "CT", label: "Central Time (CT)" },
    { value: "MT", label: "Mountain Time (MT)" },
    { value: "PT", label: "Pacific Time (PT)" },
    { value: "AKT", label: "Alaska Time (AKT)" },
    { value: "HT", label: "Hawaii Time (HT)" },
    { value: "other", label: "Other / outside the U.S." },
  ],
  days: [
    { value: "weekday", label: "Weekday (Mon–Fri)" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ],
  windows: [
    { value: "morning", label: "Morning · 8–11" },
    { value: "midday", label: "Midday · 11–2" },
    { value: "afternoon", label: "Afternoon · 2–5" },
    { value: "evening", label: "Evening · 5–8" },
  ],
};
