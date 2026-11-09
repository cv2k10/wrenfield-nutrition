import {
  PLATE_QUESTIONS,
  PLATE_TIERS,
  type PlanId,
  type PlateTier,
  type PlateTierId,
  type StageValue,
} from "./data";

/* ----------------------------- Plate scoring ------------------------------ */

export type PlateResult = {
  score: number; // 0–100
  tier: PlateTier;
  weakest: { key: string; label: string; pct: number }[]; // lowest 3 scored areas
  recommendedPlan: PlanId;
};

/** Answers: map of question id -> selected option value. */
export function scorePlateCheck(answers: Record<string, string>): PlateResult | null {
  const scored = PLATE_QUESTIONS.filter((q) => q.scoredKey);
  // All questions, including the unscored stage question, must be answered.
  if (PLATE_QUESTIONS.some((q) => !answers[q.id])) return null;

  let total = 0;
  let max = 0;
  const areas: { key: string; label: string; pct: number }[] = [];

  for (const q of scored) {
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (!opt) return null;
    const areaMax = Math.max(...q.options.map((o) => o.points));
    total += opt.points;
    max += areaMax;
    areas.push({
      key: q.scoredKey as string,
      label: q.areaLabel,
      pct: areaMax === 0 ? 0 : Math.round((opt.points / areaMax) * 100),
    });
  }

  const score = max === 0 ? 0 : Math.round((total / max) * 100);

  let tierId: PlateTierId;
  if (score < 50) tierId = "build-base";
  else if (score < 75) tierId = "fuel-strength";
  else tierId = "lock-in";

  areas.sort((a, b) => a.pct - b.pct);
  const weakest = areas.slice(0, 3);

  const stage = answers["stage"] as StageValue | undefined;
  const recommendedPlan: PlanId =
    stage === "tapering" ? "taper-maintain" : PLATE_TIERS[tierId].planId;

  return { score, tier: PLATE_TIERS[tierId], weakest, recommendedPlan };
}

/* --------------------------- Booking form model ---------------------------- */

export type BookingValues = {
  // Step 1
  stage: string;
  concern: string;
  soon: string;
  // Step 2
  goals: string[];
  preferences: string[];
  sideNotes: string;
  planInterest: string;
  // Step 3
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timeZone: string;
  day: string;
  window: string;
  consent: boolean;
};

export const EMPTY_BOOKING: BookingValues = {
  stage: "",
  concern: "",
  soon: "",
  goals: [],
  preferences: [],
  sideNotes: "",
  planInterest: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  timeZone: "",
  day: "",
  window: "",
  consent: false,
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

export type BookingErrors = Partial<Record<keyof BookingValues, string>>;

/** Validates a single step (1–3). Step 4 is a review and needs no validation. */
export function validateBookingStep(step: 1 | 2 | 3, v: BookingValues): BookingErrors {
  const e: BookingErrors = {};
  if (step === 1) {
    if (!v.stage) e.stage = "Choose the option closest to where you are.";
    if (!v.concern) e.concern = "Pick your main concern — or 'Something else'.";
    if (!v.soon) e.soon = "Let us know how soon you'd like to start.";
  } else if (step === 2) {
    if (v.goals.length === 0) e.goals = "Choose at least one goal — or 'Something else'.";
  } else {
    if (!v.firstName.trim()) e.firstName = "First name is required.";
    if (!v.lastName.trim()) e.lastName = "Last name is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look complete — check for typos.";
    if (v.phone.trim() && !PHONE_RE.test(v.phone.trim()))
      e.phone = "Use digits, spaces, and ( ) - . only.";
    if (!v.timeZone) e.timeZone = "Choose your time zone.";
    if (!v.day) e.day = "Choose a preferred day.";
    if (!v.window) e.window = "Choose a time window.";
    if (!v.consent) e.consent = "Please confirm consent so we can reply to you.";
  }
  return e;
}

export function hasErrors(e: BookingErrors): boolean {
  return Object.keys(e).length > 0;
}

/* --------------------------- Guide signup model ---------------------------- */

export type GuideValues = { firstName: string; email: string; stage: string; consent: boolean };
export type GuideErrors = Partial<Record<keyof GuideValues, string>>;

export function validateGuideForm(v: GuideValues): GuideErrors {
  const e: GuideErrors = {};
  if (!v.firstName.trim()) e.firstName = "First name is required.";
  if (!v.email.trim()) e.email = "Email is required.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email doesn't look complete — check for typos.";
  if (!v.stage) e.stage = "Choose the option closest to where you are.";
  if (!v.consent) e.consent = "Please confirm consent so we can email you the guide.";
  return e;
}
