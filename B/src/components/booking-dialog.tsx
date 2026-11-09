"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  Check,
  CircleAlert,
  ClipboardCheck,
  MailCheck,
  PartyPopper,
  PencilLine,
  Video,
} from "lucide-react";
import { AccessibleDialog } from "./dialog";
import { useFunnel } from "./funnel-context";
import { FUNNEL_OPTIONS, PLANS } from "@/lib/data";
import {
  EMPTY_BOOKING,
  hasErrors,
  validateBookingStep,
  type BookingErrors,
  type BookingValues,
} from "@/lib/scoring";

const STEP_TITLES = ["Where you are", "Your goals", "Contact & time", "Review"];

function Req() {
  return (
    <span aria-hidden="true" className="ml-0.5 text-ember">
      *
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
      {message}
    </p>
  );
}

function optionLabel(list: readonly { value: string; label: string }[], value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}

export function BookingDialog() {
  const { bookingOpen, closeBooking, prefill, plateResult } = useFunnel();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<BookingValues>(EMPTY_BOOKING);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [done, setDone] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);

  // Focus targets for every validatable field (first control of each field),
  // keyed in DOM order so the first invalid field receives focus on error.
  const stageRef = useRef<HTMLInputElement>(null);
  const concernRef = useRef<HTMLSelectElement>(null);
  const soonRef = useRef<HTMLInputElement>(null);
  const goalsRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const timeZoneRef = useRef<HTMLSelectElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const windowRef = useRef<HTMLSelectElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const focusOrder = useRef(
    new Map<keyof BookingValues, () => HTMLElement | null>([
      ["stage", () => stageRef.current],
      ["concern", () => concernRef.current],
      ["soon", () => soonRef.current],
      ["goals", () => goalsRef.current],
      ["firstName", () => firstNameRef.current],
      ["lastName", () => lastNameRef.current],
      ["email", () => emailRef.current],
      ["phone", () => phoneRef.current],
      ["timeZone", () => timeZoneRef.current],
      ["day", () => dayRef.current],
      ["window", () => windowRef.current],
      ["consent", () => consentRef.current],
    ])
  );

  const focusFirstInvalid = (errs: BookingErrors) => {
    for (const [key, getEl] of focusOrder.current) {
      if (errs[key]) {
        // one rAF lets React paint error states first; refs are already attached
        window.requestAnimationFrame(() => getEl()?.focus());
        return;
      }
    }
  };

  // Apply fresh prefill each time the dialog opens; keep prior values otherwise.
  useEffect(() => {
    if (!bookingOpen) return;
    setStep(1);
    setErrors({});
    setDone(false);
    setValues((v) => ({
      ...v,
      concern: prefill.concern ?? (v.concern || ""),
      planInterest:
        prefill.plan ?? v.planInterest ?? (plateResult ? plateResult.recommendedPlan : ""),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingOpen]);

  useEffect(() => {
    if (done) doneHeadingRef.current?.focus();
  }, [done]);

  const set = <K extends keyof BookingValues>(key: K, val: BookingValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const toggleList = (key: "goals" | "preferences", val: string, checked: boolean) => {
    setValues((v) => ({
      ...v,
      [key]: checked ? [...v[key], val] : v[key].filter((g) => g !== val),
    }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const goNext = () => {
    const e = validateBookingStep(step as 1 | 2 | 3, values);
    setErrors(e);
    if (hasErrors(e)) {
      focusFirstInvalid(e);
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      goNext();
      return;
    }
    // Step 4 review: final guard, then demo success. No network, no storage, no logging.
    const e3 = validateBookingStep(3, values);
    const e2 = validateBookingStep(2, values);
    const e1 = validateBookingStep(1, values);
    if (hasErrors(e1)) {
      setErrors(e1);
      setStep(1);
      focusFirstInvalid(e1);
      return;
    }
    if (hasErrors(e2)) {
      setErrors(e2);
      setStep(2);
      focusFirstInvalid(e2);
      return;
    }
    if (hasErrors(e3)) {
      setErrors(e3);
      setStep(3);
      focusFirstInvalid(e3);
      return;
    }
    setDone(true);
  };

  const errorList = Object.entries(errors) as [keyof BookingValues, string][];
  const platePlanName = plateResult
    ? PLANS.find((p) => p.id === plateResult.recommendedPlan)?.name
    : null;

  return (
    <AccessibleDialog
      open={bookingOpen}
      onClose={closeBooking}
      label="Book a free fit call"
      labelledBy="booking-title"
      panelRef={panelRef}
      panelClassName="sm:max-w-2xl"
    >
      {!done ? (
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col" aria-label="Book a free fit call">
          <div className="border-b border-sage-200 px-5 pb-4 pt-5 sm:px-8">
            <p className="eyebrow">Free fit call</p>
            <h2 id="booking-title" className="mt-1 text-2xl font-semibold sm:text-3xl">
              Book a free fit call
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-sm font-semibold text-sage-600" aria-live="polite">
                Step {step} of 4 · {STEP_TITLES[step - 1]}
              </p>
              <div className="flex flex-1 gap-1.5" aria-hidden="true">
                {STEP_TITLES.map((t, i) => (
                  <span
                    key={t}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < step ? "bg-sage-700" : "bg-sage-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8">
            {errorList.length > 0 && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-ember/40 bg-terracotta/10 px-4 py-3 text-[0.95rem]"
              >
                <p className="font-bold text-ember">
                  Please fix {errorList.length} {errorList.length === 1 ? "field" : "fields"}:
                </p>
                <ul className="mt-1 list-disc pl-5 text-sage-800">
                  {errorList.map(([k, msg]) => (
                    <li key={k}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <fieldset>
                  <legend className="field-label">
                    Where are you with GLP-1 medication?<Req />
                  </legend>
                  <div className="space-y-2" role="radiogroup" aria-label="Medication stage">
                    {FUNNEL_OPTIONS.stages.map((o, i) => (
                      <label
                        key={o.value}
                        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-sage-300 bg-white px-4 py-2.5 transition-colors hover:border-sage-700 has-checked:border-ember has-checked:bg-terracotta/10 has-checked:shadow-[0_0_0_1px_var(--color-ember)]"
                      >
                        <input
                          ref={i === 0 ? stageRef : undefined}
                          type="radio"
                          name="stage"
                          value={o.value}
                          className="h-5 w-5"
                          checked={values.stage === o.value}
                          onChange={() => set("stage", o.value)}
                          aria-invalid={!!errors.stage}
                          aria-describedby={errors.stage ? "stage-error" : undefined}
                        />
                        <span className="font-medium">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="stage-error" message={errors.stage} />
                </fieldset>

                <div>
                  <label htmlFor="concern" className="field-label">
                    What&apos;s your main concern right now?<Req />
                  </label>
                  <select
                    ref={concernRef}
                    id="concern"
                    className="field-input"
                    value={values.concern}
                    onChange={(e) => set("concern", e.target.value)}
                    aria-invalid={!!errors.concern}
                    aria-describedby={errors.concern ? "concern-error" : undefined}
                  >
                    <option value="">Choose one…</option>
                    {FUNNEL_OPTIONS.concerns.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <FieldError id="concern-error" message={errors.concern} />
                </div>

                <fieldset>
                  <legend className="field-label">
                    How soon do you want to start?<Req />
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {FUNNEL_OPTIONS.soon.map((o, i) => (
                      <label
                        key={o.value}
                        className="flex min-h-[44px] cursor-pointer items-center rounded-full border border-sage-300 bg-white px-4 py-2 font-medium transition-colors hover:border-sage-700 has-checked:border-ember has-checked:bg-terracotta/10 has-checked:shadow-[0_0_0_1px_var(--color-ember)]"
                      >
                        <input
                          ref={i === 0 ? soonRef : undefined}
                          type="radio"
                          name="soon"
                          value={o.value}
                          className="sr-only"
                          checked={values.soon === o.value}
                          onChange={() => set("soon", o.value)}
                          aria-invalid={!!errors.soon}
                          aria-describedby={errors.soon ? "soon-error" : undefined}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                  <FieldError id="soon-error" message={errors.soon} />
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <fieldset>
                  <legend className="field-label">
                    Top goals — pick at least one<Req />
                  </legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {FUNNEL_OPTIONS.goals.map((o, i) => (
                      <label
                        key={o.value}
                        className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border border-sage-300 bg-white px-4 py-2.5 transition-colors hover:border-sage-700 has-checked:border-leaf-deep has-checked:bg-leaf/10 has-checked:shadow-[0_0_0_1px_var(--color-leaf-deep)]"
                      >
                        <input
                          ref={i === 0 ? goalsRef : undefined}
                          type="checkbox"
                          value={o.value}
                          className="mt-1 h-5 w-5"
                          checked={values.goals.includes(o.value)}
                          onChange={(e) => toggleList("goals", o.value, e.target.checked)}
                          aria-invalid={!!errors.goals}
                          aria-describedby={errors.goals ? "goals-error" : undefined}
                        />
                        <span className="font-medium leading-snug">{o.label}</span>
                      </label>
                    ))}
                  </div>
                  <FieldError id="goals-error" message={errors.goals} />
                </fieldset>

                <fieldset>
                  <legend className="field-label">
                    Eating preferences or restrictions <span className="font-normal text-sage-600">(optional)</span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {FUNNEL_OPTIONS.preferences.map((o) => (
                      <label
                        key={o.value}
                        className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-sage-300 bg-white px-4 py-2 font-medium transition-colors hover:border-sage-700 has-checked:border-leaf-deep has-checked:bg-leaf/10"
                      >
                        <input
                          type="checkbox"
                          value={o.value}
                          className="h-4 w-4"
                          checked={values.preferences.includes(o.value)}
                          onChange={(e) => toggleList("preferences", o.value, e.target.checked)}
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="sideNotes" className="field-label">
                    Anything about side effects we should know?{" "}
                    <span className="font-normal text-sage-600">(optional)</span>
                  </label>
                  <textarea
                    id="sideNotes"
                    className="field-input min-h-24"
                    value={values.sideNotes}
                    onChange={(e) => set("sideNotes", e.target.value)}
                    placeholder="e.g. Nausea is worst the day after injection…"
                    maxLength={600}
                  />
                  <p className="mt-1 text-sm text-sage-600">
                    Food-related notes only — for symptoms, your prescriber is the right call.
                  </p>
                </div>

                <fieldset>
                  <legend className="field-label">
                    Which plan sounds closest? <span className="font-normal text-sage-600">(optional)</span>
                  </legend>
                  <div className="space-y-2">
                    {PLANS.map((p) => (
                      <label
                        key={p.id}
                        className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-sage-300 bg-white px-4 py-2.5 transition-colors hover:border-sage-700 has-checked:border-ember has-checked:bg-terracotta/10 has-checked:shadow-[0_0_0_1px_var(--color-ember)]"
                      >
                        <input
                          type="radio"
                          name="planInterest"
                          value={p.id}
                          className="h-5 w-5"
                          checked={values.planInterest === p.id}
                          onChange={() => set("planInterest", p.id)}
                        />
                        <span className="font-medium">
                          {p.name} <span className="text-sage-600">· {p.length}, {p.sessions}, {p.price} sample</span>
                        </span>
                      </label>
                    ))}
                    <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-sage-300 bg-white px-4 py-2.5 transition-colors hover:border-sage-700 has-checked:border-ember has-checked:bg-terracotta/10 has-checked:shadow-[0_0_0_1px_var(--color-ember)]">
                      <input
                        type="radio"
                        name="planInterest"
                        value="not-sure"
                        className="h-5 w-5"
                        checked={values.planInterest === "not-sure"}
                        onChange={() => set("planInterest", "not-sure")}
                      />
                      <span className="font-medium">Not sure yet — help me decide on the call</span>
                    </label>
                  </div>
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="field-label">
                      First name<Req />
                    </label>
                    <input
                      ref={firstNameRef}
                      id="firstName"
                      type="text"
                      autoComplete="given-name"
                      className="field-input"
                      value={values.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      required
                    />
                    <FieldError id="firstName-error" message={errors.firstName} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="field-label">
                      Last name<Req />
                    </label>
                    <input
                      ref={lastNameRef}
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      className="field-input"
                      value={values.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                      required
                    />
                    <FieldError id="lastName-error" message={errors.lastName} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="field-label">
                      Email<Req />
                    </label>
                    <input
                      ref={emailRef}
                      id="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      className="field-input"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                    <FieldError id="email-error" message={errors.email} />
                  </div>
                  <div>
                    <label htmlFor="phone" className="field-label">
                      Phone <span className="font-normal text-sage-600">(optional)</span>
                    </label>
                    <input
                      ref={phoneRef}
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      className="field-input"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      placeholder="(555) 010-0142"
                    />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label htmlFor="timeZone" className="field-label">
                      Time zone<Req />
                    </label>
                    <select
                      ref={timeZoneRef}
                      id="timeZone"
                      className="field-input"
                      autoComplete="off"
                      value={values.timeZone}
                      onChange={(e) => set("timeZone", e.target.value)}
                      aria-invalid={!!errors.timeZone}
                      aria-describedby={errors.timeZone ? "timeZone-error" : undefined}
                    >
                      <option value="">Choose…</option>
                      {FUNNEL_OPTIONS.timeZones.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError id="timeZone-error" message={errors.timeZone} />
                  </div>
                  <div>
                    <label htmlFor="day" className="field-label">
                      Preferred day<Req />
                    </label>
                    <select
                      ref={dayRef}
                      id="day"
                      className="field-input"
                      value={values.day}
                      onChange={(e) => set("day", e.target.value)}
                      aria-invalid={!!errors.day}
                      aria-describedby={errors.day ? "day-error" : undefined}
                    >
                      <option value="">Choose…</option>
                      {FUNNEL_OPTIONS.days.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError id="day-error" message={errors.day} />
                  </div>
                  <div>
                    <label htmlFor="window" className="field-label">
                      Time window<Req />
                    </label>
                    <select
                      ref={windowRef}
                      id="window"
                      className="field-input"
                      value={values.window}
                      onChange={(e) => set("window", e.target.value)}
                      aria-invalid={!!errors.window}
                      aria-describedby={errors.window ? "window-error" : undefined}
                    >
                      <option value="">Choose…</option>
                      {FUNNEL_OPTIONS.windows.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <FieldError id="window-error" message={errors.window} />
                  </div>
                </div>

                <div className="rounded-xl bg-wheat px-4 py-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      ref={consentRef}
                      type="checkbox"
                      className="mt-1 h-5 w-5"
                      checked={values.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? "consent-error" : undefined}
                    />
                    <span className="text-[0.95rem] leading-snug">
                      I agree to be contacted about my fit-call request.<Req />{" "}
                      <span className="text-sage-600">
                        Demo only: nothing is sent, stored, or shared.
                      </span>
                    </span>
                  </label>
                  <FieldError id="consent-error" message={errors.consent} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <p className="text-sage-600">
                  Take a quick look before requesting — Edit jumps you right back.
                </p>

                {plateResult && (
                  <div className="flex flex-wrap items-center gap-3 rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-3">
                    <ClipboardCheck className="h-5 w-5 flex-none text-leaf-deep" aria-hidden="true" />
                    <p className="text-[0.95rem]">
                      <strong>Plate Check:</strong> {plateResult.score}/100 · {plateResult.tier.name}
                      {platePlanName ? <> · suggested plan: {platePlanName}</> : null}
                    </p>
                  </div>
                )}

                <ReviewSection
                  title="Where you are"
                  onEdit={() => setStep(1)}
                  rows={[
                    ["Stage", optionLabel(FUNNEL_OPTIONS.stages, values.stage)],
                    ["Main concern", optionLabel(FUNNEL_OPTIONS.concerns, values.concern)],
                    ["Start", optionLabel(FUNNEL_OPTIONS.soon, values.soon)],
                  ]}
                />
                <ReviewSection
                  title="Your goals"
                  onEdit={() => setStep(2)}
                  rows={[
                    [
                      "Goals",
                      values.goals.map((g) => optionLabel(FUNNEL_OPTIONS.goals, g)).join("; "),
                    ],
                    [
                      "Preferences",
                      values.preferences.length
                        ? values.preferences
                            .map((p) => optionLabel(FUNNEL_OPTIONS.preferences, p))
                            .join(", ")
                        : "None noted",
                    ],
                    ["Side-effect notes", values.sideNotes.trim() || "None added"],
                    [
                      "Plan interest",
                      values.planInterest === "not-sure"
                        ? "Not sure yet"
                        : values.planInterest
                          ? (PLANS.find((p) => p.id === values.planInterest)?.name ?? values.planInterest)
                          : "No preference",
                    ],
                  ]}
                />
                <ReviewSection
                  title="Contact & time"
                  onEdit={() => setStep(3)}
                  rows={[
                    ["Name", `${values.firstName} ${values.lastName}`.trim()],
                    ["Email", values.email],
                    ["Phone", values.phone.trim() || "—"],
                    [
                      "Best time",
                      `${optionLabel(FUNNEL_OPTIONS.days, values.day)} · ${optionLabel(
                        FUNNEL_OPTIONS.windows,
                        values.window
                      )} · ${optionLabel(FUNNEL_OPTIONS.timeZones, values.timeZone)}`,
                    ],
                  ]}
                />

                <p className="rounded-xl bg-wheat px-4 py-3 text-sm text-sage-700">
                  By requesting, you agree to be contacted about your request. This is a demo: your
                  request will not actually be sent.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-sage-200 bg-cream px-5 py-4 sm:px-8">
            {step > 1 ? (
              <button type="button" onClick={goBack} className="btn btn-secondary">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            {step < 4 ? (
              <button type="submit" className="btn btn-primary">
                {step === 3 ? (
                  <>
                    Review request
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Next: {STEP_TITLES[step]}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            ) : (
              <button type="submit" className="btn btn-primary">
                <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
                Request my call
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 sm:px-10" role="status">
          <div className="mx-auto max-w-md text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf/15">
              <PartyPopper className="h-8 w-8 text-leaf-deep" aria-hidden="true" />
            </span>
            <h2 ref={doneHeadingRef} tabIndex={-1} className="mt-4 text-3xl font-semibold focus:outline-none">
              Request noted, {values.firstName.trim() || "friend"}
            </h2>
            <p className="mt-2 text-sage-600">
              Here&apos;s what would happen next if this weren&apos;t a demo.
            </p>
          </div>

          <ol className="mx-auto mt-6 max-w-md space-y-3 text-left">
            {[
              {
                icon: MailCheck,
                title: "Confirmation email",
                text: `A summary lands at ${values.email.trim() || "your inbox"} within minutes.`,
              },
              {
                icon: Video,
                title: "A coach replies within two business days",
                text: `With a video link for a ${optionLabel(FUNNEL_OPTIONS.days, values.day)} ${optionLabel(FUNNEL_OPTIONS.windows, values.window).toLowerCase()} slot (${values.timeZone || "your time zone"}).`,
              },
              {
                icon: Check,
                title: "You meet for 15–20 minutes",
                text: "Questions welcome, fit decided together, zero pressure to book anything paid.",
              },
            ].map((t, i) => (
              <li key={t.title} className="flex gap-3 rounded-xl border border-sage-200 bg-white/70 px-4 py-3">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-wheat text-sage-800">
                  <t.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold">
                    <span className="sr-only">Step {i + 1}: </span>
                    {t.title}
                  </p>
                  <p className="text-[0.95rem] text-sage-600">{t.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mx-auto mt-6 max-w-md rounded-xl border border-ember/40 bg-terracotta/10 px-4 py-3 text-center text-[0.95rem] font-semibold text-ember">
            Demo only: your request has not been sent.
          </p>

          <div className="mt-6 text-center">
            <button type="button" onClick={closeBooking} className="btn btn-primary">
              Back to the site
            </button>
          </div>
        </div>
      )}
    </AccessibleDialog>
  );
}

function ReviewSection({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
}) {
  return (
    <section className="rounded-xl border border-sage-200 bg-white/70 px-4 py-3" aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 font-semibold text-ember hover:bg-terracotta/10"
          aria-label={`Edit ${title}`}
        >
          <PencilLine className="h-4 w-4" aria-hidden="true" />
          Edit
        </button>
      </div>
      <dl className="mt-1 divide-y divide-sage-100 text-[0.95rem]">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2">
            <dt className="font-semibold text-sage-600">{k}</dt>
            <dd className="text-sage-800">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Small connector used by CTAs elsewhere to open the funnel. */
export function useOpenBooking() {
  const { openBooking } = useFunnel();
  return openBooking;
}
