import { scorePlateCheck, validateBookingStep, validateGuideForm, EMPTY_BOOKING } from "../src/lib/scoring";
import { PLATE_QUESTIONS } from "../src/lib/data";

let failures = 0;
function check(name: string, cond: boolean) {
  if (!cond) {
    failures++;
    console.error("FAIL:", name);
  } else {
    console.log("ok:", name);
  }
}

// All-best answers should give 100 and tier lock-in
const bestAnswers: Record<string, string> = {};
for (const q of PLATE_QUESTIONS) bestAnswers[q.id] = q.options[q.options.length - 1].value;
bestAnswers["stage"] = "steady";
const best = scorePlateCheck(bestAnswers);
check("best score is 100", best?.score === 100);
check("best tier is lock-in", best?.tier.id === "lock-in");
check("steady + lock-in recommends steady-strength", best?.recommendedPlan === "steady-strength");

// All-worst answers
const worstAnswers: Record<string, string> = {};
for (const q of PLATE_QUESTIONS) worstAnswers[q.id] = q.options[0].value;
worstAnswers["stage"] = "just-starting";
const worst = scorePlateCheck(worstAnswers);
check("worst score is 0", worst?.score === 0);
check("worst tier is build-base", worst?.tier.id === "build-base");
check("build-base recommends fresh-start", worst?.recommendedPlan === "fresh-start");

// Middle: exactly half points -> ~50 -> fuel-strength
const midAnswers: Record<string, string> = {};
for (const q of PLATE_QUESTIONS) midAnswers[q.id] = q.options[1].value; // points 1 of 3 => 33
midAnswers["stage"] = "steady";
const mid1 = scorePlateCheck(midAnswers);
check("low-mid score 33 is build-base", mid1?.score === 33 && mid1?.tier.id === "build-base");
const mid2Answers: Record<string, string> = {};
for (const q of PLATE_QUESTIONS) mid2Answers[q.id] = q.options[2].value; // 2/3 => 67
mid2Answers["stage"] = "steady";
const mid2 = scorePlateCheck(mid2Answers);
check("mid score 67 is fuel-strength", mid2?.score === 67 && mid2?.tier.id === "fuel-strength");
check("fuel-strength recommends steady-strength", mid2?.recommendedPlan === "steady-strength");

// Tapering overrides plan
const taperAnswers = { ...bestAnswers, stage: "tapering" };
const taper = scorePlateCheck(taperAnswers);
check("tapering always recommends taper-maintain", taper?.recommendedPlan === "taper-maintain");

// Weakest areas: three entries, ascending pct
check("weakest has 3 areas", best?.weakest.length === 3);
const mixed = scorePlateCheck({
  stage: "steady",
  meals: "three-steady",
  protein: "rarely",
  fluids: "automatic",
  fiber: "rarely",
  strength: "occasional",
  "side-effects": "rarely",
});
check(
  "weakest sorted ascending, protein/fiber first",
  mixed !== null &&
    mixed.weakest[0].pct <= mixed.weakest[1].pct &&
    mixed.weakest[1].pct <= mixed.weakest[2].pct &&
    ["protein", "fiber", "sideEffects"].includes(mixed.weakest[0].key)
);

// Missing answer -> null
check("missing answers return null", scorePlateCheck({}) === null);

// Booking validation
const s1 = validateBookingStep(1, EMPTY_BOOKING);
check("step1 empty has 3 errors", Object.keys(s1).length === 3);
const s1ok = validateBookingStep(1, { ...EMPTY_BOOKING, stage: "steady", concern: "nausea", soon: "month" });
check("step1 valid passes", Object.keys(s1ok).length === 0);

check("step2 needs a goal", Object.keys(validateBookingStep(2, EMPTY_BOOKING)).length === 1);
check("step2 valid passes", Object.keys(validateBookingStep(2, { ...EMPTY_BOOKING, goals: ["protein"] })).length === 0);

const s3 = validateBookingStep(3, EMPTY_BOOKING);
check("step3 empty has 7 errors", Object.keys(s3).length === 7);
const s3ok = validateBookingStep(3, {
  ...EMPTY_BOOKING,
  firstName: "Alex",
  lastName: "Wren",
  email: "alex@example.com",
  timeZone: "ET",
  day: "weekday",
  window: "morning",
  consent: true,
});
check("step3 valid passes", Object.keys(s3ok).length === 0);
const s3bad = validateBookingStep(3, { ...s3okProfile(), email: "nope", phone: "abc" });
check("step3 bad email + bad phone flagged", !!s3bad.email && !!s3bad.phone);
function s3okProfile() {
  return {
    ...EMPTY_BOOKING,
    firstName: "A",
    lastName: "B",
    email: "a@b.co",
    timeZone: "CT",
    day: "saturday",
    window: "evening",
    consent: true,
  };
}
check("optional phone may be empty", !validateBookingStep(3, { ...s3okProfile() }).phone);

// Guide validation
const g = validateGuideForm({ firstName: "", email: "bad", stage: "", consent: false });
check("guide empty has 4 errors", Object.keys(g).length === 4);
const gOk = validateGuideForm({ firstName: "A", email: "a@b.co", stage: "steady", consent: true });
check("guide valid passes", Object.keys(gOk).length === 0);

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log("\nAll logic tests passed.");
