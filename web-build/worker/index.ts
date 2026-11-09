// Serves the static site (out/) and stores fit-call requests and Protein Plate Guide signups in
// Workers KV, with an email alert for each one. Field rules come from the same validators the
// browser uses (src/lib/scoring.ts), so the two can't drift apart.
import { FUNNEL_OPTIONS, PLANS } from "../src/lib/data";
import {
  EMPTY_BOOKING,
  hasErrors,
  validateBookingStep,
  validateGuideForm,
  type BookingValues,
  type GuideValues,
} from "../src/lib/scoring";

interface Env {
  REQUESTS: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number; metadata?: unknown }): Promise<void>;
  };
  ASSETS: { fetch(request: Request): Promise<Response> };
  EMAIL?: { send(message: Record<string, unknown>): Promise<{ messageId: string }> };
}
interface Context {
  waitUntil(promise: Promise<unknown>): void;
}

const MAX_PER_HOUR = 5;
const ALERT_FROM = { email: "alerts@createyourbestsite.com", name: "Wrenfield Nutrition website" };
const ALERT_TO = "cv2k10@gmail.com";
const LIMITS: Record<string, number> = { email: 200, phone: 40, sideNotes: 2000 };
const values = (list: readonly { value: string }[]) => list.map((o) => o.value);
const label = (list: readonly { value: string; label: string }[], v: string) => list.find((o) => o.value === v)?.label ?? v;
const CHOICES: Record<string, string[]> = {
  stage: values(FUNNEL_OPTIONS.stages),
  concern: values(FUNNEL_OPTIONS.concerns),
  soon: values(FUNNEL_OPTIONS.soon),
  timeZone: values(FUNNEL_OPTIONS.timeZones),
  day: values(FUNNEL_OPTIONS.days),
  window: values(FUNNEL_OPTIONS.windows),
};
const PLAN_IDS = PLANS.map((p) => p.id as string);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

const str = (v: unknown, key: string) =>
  typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, LIMITS[key] ?? 120) : "";
const list = (v: unknown, allowed: string[]) =>
  Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string" && allowed.includes(x)))] : [];

async function hashIp(ip: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`wrenfield:${ip}`));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// A failed alert must never lose the request, which is already saved by this point.
async function sendAlert(subject: string, lines: [string, string][], replyTo: string, env: Env) {
  if (!env.EMAIL) return;
  const text = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  try {
    const { messageId } = await env.EMAIL.send({
      from: ALERT_FROM,
      to: ALERT_TO,
      subject: subject.replace(/\s+/g, " ").slice(0, 180),
      text,
      replyTo,
    });
    console.log(`alert sent ${messageId}`);
  } catch (err) {
    console.error(`alert failed: ${(err as Error).message}`);
  }
}

type Lead = { kind: "fit-call" | "guide"; record: Record<string, unknown>; subject: string; lines: [string, string][]; email: string; name: string };

function parseBooking(input: Record<string, unknown>): Lead | string {
  const v: BookingValues = {
    ...EMPTY_BOOKING,
    stage: str(input.stage, "stage"),
    concern: str(input.concern, "concern"),
    soon: str(input.soon, "soon"),
    goals: list(input.goals, values(FUNNEL_OPTIONS.goals)),
    preferences: list(input.preferences, values(FUNNEL_OPTIONS.preferences)),
    sideNotes: str(input.sideNotes, "sideNotes"),
    planInterest: str(input.planInterest, "planInterest"),
    firstName: str(input.firstName, "firstName"),
    lastName: str(input.lastName, "lastName"),
    email: str(input.email, "email"),
    phone: str(input.phone, "phone"),
    timeZone: str(input.timeZone, "timeZone"),
    day: str(input.day, "day"),
    window: str(input.window, "window"),
    consent: input.consent === true,
  };
  for (const step of [1, 2, 3] as const) {
    if (hasErrors(validateBookingStep(step, v))) return "Please complete every required field.";
  }
  for (const [key, allowed] of Object.entries(CHOICES)) {
    if (!allowed.includes(v[key as keyof BookingValues] as string)) return "Please check your answers and try again.";
  }
  if (v.planInterest && !PLAN_IDS.includes(v.planInterest) && v.planInterest !== "unsure") v.planInterest = "";
  const plate = {
    plateScore: /^\d{1,3}$/.test(str(input.plateScore, "plateScore")) ? str(input.plateScore, "plateScore") : "",
    plateResult: str(input.plateResult, "plateResult"),
    plateRecommended: PLAN_IDS.includes(str(input.plateRecommended, "plateRecommended")) ? str(input.plateRecommended, "plateRecommended") : "",
  };
  const plan = PLANS.find((p) => p.id === v.planInterest)?.name ?? (v.planInterest || "Not sure yet");
  return {
    kind: "fit-call",
    record: { ...v, ...plate },
    email: v.email,
    name: v.firstName,
    subject: `New fit-call request from ${v.firstName} ${v.lastName}: ${plan} (${label(FUNNEL_OPTIONS.soon, v.soon)})`,
    lines: [
      ["Name", `${v.firstName} ${v.lastName}`],
      ["Email", v.email],
      ["Phone", v.phone],
      ["Medication stage", label(FUNNEL_OPTIONS.stages, v.stage)],
      ["Main concern", label(FUNNEL_OPTIONS.concerns, v.concern)],
      ["Wants to start", label(FUNNEL_OPTIONS.soon, v.soon)],
      ["Goals", v.goals.map((g) => label(FUNNEL_OPTIONS.goals, g)).join(", ")],
      ["Eating preferences", v.preferences.map((g) => label(FUNNEL_OPTIONS.preferences, g)).join(", ")],
      ["Side-effect notes", v.sideNotes],
      ["Plan interest", plan],
      ["Plate Check", plate.plateScore ? `${plate.plateScore}/100, ${plate.plateResult}` : ""],
      ["Preferred time", `${label(FUNNEL_OPTIONS.days, v.day)}, ${label(FUNNEL_OPTIONS.windows, v.window)} (${v.timeZone})`],
    ],
  };
}

function parseGuide(input: Record<string, unknown>): Lead | string {
  const v: GuideValues = {
    firstName: str(input.firstName, "firstName"),
    email: str(input.email, "email"),
    stage: str(input.stage, "stage"),
    consent: input.consent === true,
  };
  if (Object.keys(validateGuideForm(v)).length) return "Please complete every required field.";
  if (!CHOICES.stage.includes(v.stage)) return "Please check your answers and try again.";
  return {
    kind: "guide",
    record: v,
    email: v.email,
    name: v.firstName,
    subject: `Protein Plate Guide signup: ${v.firstName} (${label(FUNNEL_OPTIONS.stages, v.stage)})`,
    lines: [["Name", v.firstName], ["Email", v.email], ["Medication stage", label(FUNNEL_OPTIONS.stages, v.stage)]],
  };
}

async function saveLead(parse: (input: Record<string, unknown>) => Lead | string, request: Request, env: Env, ctx: Context) {
  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!input || typeof input !== "object") return json({ error: "Invalid request." }, 400);
  // Bots fill the hidden field; answer as if it worked and store nothing.
  if (input.website) return json({ ok: true }, 201);

  const lead = parse(input);
  if (typeof lead === "string") return json({ error: lead }, 422);

  const ipHash = await hashIp(request.headers.get("cf-connecting-ip") ?? "unknown");
  const rateKey = `rate:${ipHash}`;
  const recent = Number((await env.REQUESTS.get(rateKey)) ?? 0);
  if (recent >= MAX_PER_HOUR) return json({ error: "Too many requests. Please try again in a little while." }, 429);

  const createdAt = new Date().toISOString();
  await env.REQUESTS.put(`request:${createdAt}:${crypto.randomUUID()}`, JSON.stringify({ createdAt, kind: lead.kind, ...lead.record }), {
    metadata: { kind: lead.kind, name: lead.name },
  });
  await env.REQUESTS.put(rateKey, String(recent + 1), { expirationTtl: 3600 });
  ctx.waitUntil(sendAlert(lead.subject, lead.lines, lead.email, env));
  return json({ ok: true }, 201);
}

export default {
  async fetch(request: Request, env: Env, ctx: Context) {
    const { pathname } = new URL(request.url);
    const parse = pathname === "/api/requests" ? parseBooking : pathname === "/api/guide" ? parseGuide : null;
    if (parse) {
      if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
      try {
        return await saveLead(parse, request, env, ctx);
      } catch {
        return json({ error: "Something went wrong saving your request." }, 500);
      }
    }
    if (pathname.startsWith("/api/")) return json({ error: "Not found." }, 404);
    return env.ASSETS.fetch(request);
  },
};
