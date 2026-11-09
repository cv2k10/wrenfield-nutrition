"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  bookingSteps,
  concernOptions,
  demoDisclaimer,
  eatingPreferences,
  goalOptions,
  medicationStages,
  planInterestOptions,
  plans,
  preferredDays,
  startTimelines,
  successDisclaimer,
  timeWindows,
  usTimeZones,
} from "@/content/site";
import { Dialog } from "./dialog";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon } from "./brand";
import type { BookingPreset } from "./funnel-types";

type BookingValues = {
  stage: string;
  concern: string;
  timeline: string;
  goals: string[];
  eatingPreference: string;
  notes: string;
  plan: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timeZone: string;
  day: string;
  timeWindow: string;
  consent: boolean;
};

type ErrorKey =
  | "stage"
  | "concern"
  | "timeline"
  | "goals"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "timeZone"
  | "day"
  | "timeWindow"
  | "consent";

type Errors = Partial<Record<ErrorKey, string>>;

const emptyValues: BookingValues = {
  stage: "",
  concern: "",
  timeline: "",
  goals: [],
  eatingPreference: "",
  notes: "",
  plan: "unsure",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  timeZone: "Eastern (ET)",
  day: "Any weekday",
  timeWindow: "Any time that week",
  consent: false,
};

const fieldIds: Record<ErrorKey, string> = {
  stage: "booking-stage-0",
  concern: "booking-concern",
  timeline: "booking-timeline",
  goals: "booking-goal-0",
  firstName: "booking-firstName",
  lastName: "booking-lastName",
  email: "booking-email",
  phone: "booking-phone",
  timeZone: "booking-timeZone",
  day: "booking-day",
  timeWindow: "booking-timeWindow",
  consent: "booking-consent",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateStep(step: number, values: BookingValues): Errors {
  const errors: Errors = {};
  if (step === 1) {
    if (!values.stage) errors.stage = "Choose where you are so we can pitch the call correctly.";
    if (!values.concern) errors.concern = "Pick the concern closest to yours.";
    if (!values.timeline) errors.timeline = "Let us know your rough timing.";
  }
  if (step === 2) {
    if (values.goals.length === 0) errors.goals = "Choose at least one goal for the call.";
  }
  if (step === 3) {
    if (!values.firstName.trim()) errors.firstName = "Enter your first name.";
    if (!values.lastName.trim()) errors.lastName = "Enter your last name.";
    if (!values.email.trim()) {
      errors.email = "Enter your email so we can confirm a time.";
    } else if (!emailPattern.test(values.email.trim())) {
      errors.email = "Enter an email in the format name@example.com.";
    }
    const digits = values.phone.replace(/\D/g, "");
    if (values.phone.trim() && digits.length < 7) {
      errors.phone = "Enter a phone number with at least 7 digits, or leave it blank.";
    }
    if (!values.timeZone) errors.timeZone = "Choose your time zone.";
    if (!values.day) errors.day = "Choose a preferred day.";
    if (!values.timeWindow) errors.timeWindow = "Choose a preferred time window.";
    if (!values.consent) errors.consent = "Tick the consent box so we know you are happy to be contacted.";
  }
  return errors;
}

function labelFrom(list: readonly { value: string; label: string }[], value: string) {
  return list.find((item) => item.value === value)?.label ?? "Not chosen";
}

export function BookingDialog({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset: BookingPreset;
  onClose: () => void;
}) {
  const generatedId = useId();
  const titleId = `${generatedId}-booking-title`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      closeLabel="Close booking form"
      size="lg"
      panelClassName="sm:max-w-[40rem]"
    >
      {/* Mounted only while the dialog is open, so each opening starts from the CTA preset. */}
      <BookingFlow preset={preset} onClose={onClose} titleId={titleId} />
    </Dialog>
  );
}

function BookingFlow({
  preset,
  onClose,
  titleId,
}: {
  preset: BookingPreset;
  onClose: () => void;
  titleId: string;
}) {
  const baseId = useId();
  const descriptionId = `${baseId}-booking-description`;

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<BookingValues>(() => ({
    ...emptyValues,
    concern: preset.concern ?? "",
    plan: preset.planId ?? "unsure",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const successRef = useRef<HTMLHeadingElement | null>(null);
  const prevStepRef = useRef(step);

  /* Move focus to the step heading whenever the step changes (not on first open). */
  useEffect(() => {
    if (!submitted && prevStepRef.current !== step) {
      headingRef.current?.focus();
    }
    prevStepRef.current = step;
  }, [step, submitted]);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const focusFirstError = useCallback((nextErrors: Errors) => {
    const firstKey = (Object.keys(fieldIds) as ErrorKey[]).find((key) => nextErrors[key]);
    if (!firstKey) return;
    window.setTimeout(() => {
      const node = document.getElementById(fieldIds[firstKey]);
      node?.focus();
      node?.scrollIntoView({ block: "center" });
    }, 60);
  }, []);

  const update = <K extends keyof BookingValues>(key: K, value: BookingValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as ErrorKey];
      return next;
    });
  };

  const goNext = () => {
    const nextErrors = validateStep(step, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }
    setStep((current) => Math.min(4, current + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(1, current - 1));
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
  };

  const handleSubmit = () => {
    const step1 = validateStep(1, values);
    const step2 = validateStep(2, values);
    const step3 = validateStep(3, values);
    const combined = { ...step1, ...step2, ...step3 };
    if (Object.keys(combined).length > 0) {
      const firstStep = Object.keys(step1).length > 0 ? 1 : Object.keys(step2).length > 0 ? 2 : 3;
      setStep(firstStep);
      setErrors(combined);
      focusFirstError(combined);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const errorCount = Object.keys(errors).length;
  const planLabel =
    planInterestOptions.find((option) => option.value === values.plan)?.label ??
    "Not sure yet — recommend one";
  const chosenPlan = plans.find((plan) => plan.id === values.plan);
  const snapshot = preset.plateCheck;

  const errorSummary = (
    <div aria-live="assertive" role="status" className="min-h-0">
      {errorCount > 0 ? (
        <p className="mb-4 flex items-start gap-2 rounded-lg border border-clay-text/40 bg-clay-wash px-3 py-2 text-sm font-medium text-clay-text">
          <InfoIcon className="mt-0.5 h-4 w-4" />
          <span>
            Please check {errorCount === 1 ? "the highlighted field" : `${errorCount} highlighted fields`} before continuing.
          </span>
        </p>
      ) : null}
    </div>
  );

  const fieldError = (key: ErrorKey) =>
    errors[key] ? (
      <p id={`${baseId}-${key}-error`} className="mt-1.5 text-sm font-medium text-clay-text">
        {errors[key]}
      </p>
    ) : null;

  const describedBy = (key: ErrorKey, hintId?: string) => {
    const ids: string[] = [];
    if (errors[key]) ids.push(`${baseId}-${key}-error`);
    if (hintId) ids.push(hintId);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  const stepOne = (
    <div className="space-y-6">
      <fieldset>
        <legend className="field-label">
          Where are you with a GLP-1 medication? <span className="text-clay-text">*</span>
        </legend>
        <p id={`${baseId}-stage-hint`} className="mb-3 text-sm text-cocoa">
          Semaglutide, tirzepatide or similar. Nothing about dosing is needed here.
        </p>
        <div className="space-y-2.5" aria-describedby={describedBy("stage", `${baseId}-stage-hint`)}>
          {medicationStages.map((option, index) => (
            <label key={option.value} className="choice">
              <input
                type="radio"
                id={index === 0 ? "booking-stage-0" : undefined}
                name="booking-stage"
                value={option.value}
                checked={values.stage === option.value}
                aria-describedby={describedBy("stage")}
                onChange={() => update("stage", option.value)}
              />
              <span>
                <span className="block font-semibold text-sage">{option.label}</span>
                <span className="block text-sm text-cocoa">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {fieldError("stage")}
      </fieldset>

      <div>
        <label htmlFor="booking-concern" className="field-label">
          What is top of mind? <span className="text-clay-text">*</span>
        </label>
        <select
          id="booking-concern"
          className="field-control"
          value={values.concern}
          onChange={(event) => update("concern", event.target.value)}
          aria-invalid={Boolean(errors.concern)}
          aria-describedby={describedBy("concern")}
        >
          <option value="">Choose what fits best</option>
          {concernOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldError("concern")}
      </div>

      <div>
        <label htmlFor="booking-timeline" className="field-label">
          How soon would you like to start? <span className="text-clay-text">*</span>
        </label>
        <select
          id="booking-timeline"
          className="field-control"
          value={values.timeline}
          onChange={(event) => update("timeline", event.target.value)}
          aria-invalid={Boolean(errors.timeline)}
          aria-describedby={describedBy("timeline")}
        >
          <option value="">Choose a timeframe</option>
          {startTimelines.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldError("timeline")}
      </div>
    </div>
  );

  const stepTwo = (
    <div className="space-y-6">
      {snapshot ? (
        <div className="rounded-xl border border-olive/40 bg-sage-wash p-4">
          <p className="eyebrow">From your Plate Check</p>
          <p className="mt-1 font-serif text-xl text-sage">
            {snapshot.score}/100 · {snapshot.resultTitle}
          </p>
          <p className="mt-1 text-sm text-cocoa">
            Recommended plan: {plans.find((plan) => plan.id === snapshot.planId)?.name}.
            We&apos;ll look at your three focus areas together.
          </p>
        </div>
      ) : null}

      <fieldset>
        <legend className="field-label">
          What do you want from coaching? <span className="text-clay-text">*</span>
        </legend>
        <p id={`${baseId}-goals-hint`} className="mb-3 text-sm text-cocoa">
          Choose as many as apply. This shapes the call, not a sales pitch.
        </p>
        <div className="space-y-2.5" aria-describedby={describedBy("goals", `${baseId}-goals-hint`)}>
          {goalOptions.map((goal, index) => (
            <label key={goal} className="choice">
              <input
                type="checkbox"
                id={index === 0 ? "booking-goal-0" : undefined}
                name="booking-goals"
                value={goal}
                checked={values.goals.includes(goal)}
                aria-invalid={Boolean(errors.goals)}
                aria-describedby={describedBy("goals")}
                onChange={(event) => {
                  const next = event.target.checked
                    ? [...values.goals, goal]
                    : values.goals.filter((item) => item !== goal);
                  update("goals", next);
                }}
              />
              <span className="text-sage">{goal}</span>
            </label>
          ))}
        </div>
        {fieldError("goals")}
      </fieldset>

      <div>
        <label htmlFor="booking-eatingPreference" className="field-label">
          Eating preferences or restrictions
        </label>
        <select
          id="booking-eatingPreference"
          className="field-control"
          value={values.eatingPreference}
          onChange={(event) => update("eatingPreference", event.target.value)}
          autoComplete="off"
        >
          <option value="">No preference / prefer to discuss</option>
          {eatingPreferences.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="booking-plan" className="field-label">
          Plan you&apos;re curious about
        </label>
        <select
          id="booking-plan"
          className="field-control"
          value={values.plan}
          onChange={(event) => update("plan", event.target.value)}
        >
          {planInterestOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-sm text-cocoa">
          All prices shown are sample prices for this concept site.
        </p>
      </div>

      <div>
        <label htmlFor="booking-notes" className="field-label">
          Anything about side effects or your week? (optional)
        </label>
        <textarea
          id="booking-notes"
          rows={3}
          className="field-control min-h-[5.5rem] resize-y"
          placeholder="For example: nausea in the mornings, mostly cooking for one, night shifts."
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
        />
        <p className="mt-1.5 text-sm text-cocoa">
          Please don&apos;t include prescription numbers or other sensitive medical details.
        </p>
      </div>
    </div>
  );

  const stepThree = (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-firstName" className="field-label">
            First name <span className="text-clay-text">*</span>
          </label>
          <input
            id="booking-firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            className="field-control"
            value={values.firstName}
            onChange={(event) => update("firstName", event.target.value)}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy("firstName")}
            required
          />
          {fieldError("firstName")}
        </div>
        <div>
          <label htmlFor="booking-lastName" className="field-label">
            Last name <span className="text-clay-text">*</span>
          </label>
          <input
            id="booking-lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            className="field-control"
            value={values.lastName}
            onChange={(event) => update("lastName", event.target.value)}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy("lastName")}
            required
          />
          {fieldError("lastName")}
        </div>
      </div>

      <div>
        <label htmlFor="booking-email" className="field-label">
          Email <span className="text-clay-text">*</span>
        </label>
        <input
          id="booking-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="field-control"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={describedBy("email")}
          required
        />
        {fieldError("email")}
      </div>

      <div>
        <label htmlFor="booking-phone" className="field-label">
          Phone (optional)
        </label>
        <input
          id="booking-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="field-control"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy("phone")}
        />
        {fieldError("phone")}
      </div>

      <div>
        <label htmlFor="booking-timeZone" className="field-label">
          Your time zone <span className="text-clay-text">*</span>
        </label>
        <select
          id="booking-timeZone"
          className="field-control"
          value={values.timeZone}
          onChange={(event) => update("timeZone", event.target.value)}
          aria-invalid={Boolean(errors.timeZone)}
          aria-describedby={describedBy("timeZone")}
        >
          {usTimeZones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        {fieldError("timeZone")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-day" className="field-label">
            Preferred day <span className="text-clay-text">*</span>
          </label>
          <select
            id="booking-day"
            className="field-control"
            value={values.day}
            onChange={(event) => update("day", event.target.value)}
            aria-invalid={Boolean(errors.day)}
            aria-describedby={describedBy("day")}
          >
            {preferredDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {fieldError("day")}
        </div>
        <div>
          <label htmlFor="booking-timeWindow" className="field-label">
            Preferred time <span className="text-clay-text">*</span>
          </label>
          <select
            id="booking-timeWindow"
            className="field-control"
            value={values.timeWindow}
            onChange={(event) => update("timeWindow", event.target.value)}
            aria-invalid={Boolean(errors.timeWindow)}
            aria-describedby={describedBy("timeWindow")}
          >
            {timeWindows.map((window) => (
              <option key={window} value={window}>
                {window}
              </option>
            ))}
          </select>
          {fieldError("timeWindow")}
        </div>
      </div>

      <div>
        <label htmlFor="booking-consent" className="choice items-start">
          <input
            type="checkbox"
            id="booking-consent"
            name="consent"
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            required
          />
          <span className="text-sm text-sage">
            Yes, Wrenfield may contact me about this free fit call. I understand this is a
            concept site and nothing is sent. <span className="text-clay-text">*</span>
          </span>
        </label>
        {fieldError("consent")}
      </div>
    </div>
  );

  const review = (
    <div className="space-y-4">
      <section className="rounded-xl border border-line bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-lg text-sage">Where you are</h3>
          <button
            type="button"
            className="link-inline inline-flex min-h-11 items-center text-sm"
            onClick={() => goToStep(1)}
          >
            Edit<span className="sr-only"> where you are</span>
          </button>
        </div>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Medication stage</dt>
            <dd className="text-sage">{labelFrom(medicationStages, values.stage)}</dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Main concern</dt>
            <dd className="text-sage">{labelFrom(concernOptions, values.concern)}</dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Timing</dt>
            <dd className="text-sage">{labelFrom(startTimelines, values.timeline)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-line bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-lg text-sage">Your goals</h3>
          <button
            type="button"
            className="link-inline inline-flex min-h-11 items-center text-sm"
            onClick={() => goToStep(2)}
          >
            Edit<span className="sr-only"> your goals</span>
          </button>
        </div>
        <ul className="mt-2 space-y-1.5 text-sm text-sage">
          {values.goals.map((goal) => (
            <li key={goal} className="flex items-start gap-2">
              <CheckIcon className="mt-1 h-4 w-4 text-leaf-deep" />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-cocoa">
          <span className="font-semibold text-sage">Eating:</span>{" "}
          {values.eatingPreference || "No preference shared"}
        </p>
        <p className="mt-1 text-sm text-cocoa">
          <span className="font-semibold text-sage">Plan interest:</span> {planLabel}
        </p>
        {values.notes ? (
          <p className="mt-1 text-sm text-cocoa">
            <span className="font-semibold text-sage">Notes:</span> {values.notes}
          </p>
        ) : null}
        {snapshot ? (
          <p className="mt-3 rounded-lg bg-sage-wash px-3 py-2 text-sm text-sage">
            Plate Check: {snapshot.score}/100 · {snapshot.resultTitle}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border border-line bg-white/70 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-lg text-sage">Contact and time</h3>
          <button
            type="button"
            className="link-inline inline-flex min-h-11 items-center text-sm"
            onClick={() => goToStep(3)}
          >
            Edit<span className="sr-only"> contact and time</span>
          </button>
        </div>
        <dl className="mt-2 space-y-2 text-sm">
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Name</dt>
            <dd className="text-sage">
              {values.firstName} {values.lastName}
            </dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Email</dt>
            <dd className="break-words text-sage">{values.email}</dd>
          </div>
          {values.phone ? (
            <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
              <dt className="font-semibold text-cocoa">Phone</dt>
              <dd className="text-sage">{values.phone}</dd>
            </div>
          ) : null}
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Preferred time</dt>
            <dd className="text-sage">
              {values.day}, {values.timeWindow} · {values.timeZone}
            </dd>
          </div>
        </dl>
      </section>

      <div className="rounded-xl border border-wheat-deep bg-wheat p-4 text-sm text-cocoa">
        <p>
          <span className="font-semibold text-sage">What happens next:</span> a real
          Wrenfield coach would reply within one business day, offer two or three call
          times, and answer questions before you pay anything.
        </p>
        <p className="mt-2">{demoDisclaimer}</p>
      </div>
    </div>
  );

  const success = (
    <div className="px-5 pb-6 pt-7 sm:px-7">
      <div className="flex items-start gap-3 pr-12">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-leaf-wash text-leaf-deep">
          <CheckIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="eyebrow">Request received (demo)</p>
          <h2
            id={titleId}
            ref={successRef}
            tabIndex={-1}
            className="mt-1 font-serif text-2xl leading-snug text-sage sm:text-3xl"
          >
            Thanks, {values.firstName || "friend"} — here&apos;s what would happen next.
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-line bg-white/75 p-4">
        <h3 className="font-serif text-lg text-sage">Your summary</h3>
        <dl className="mt-2 space-y-1.5 text-sm">
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Contact</dt>
            <dd className="break-words text-sage">
              {values.firstName} {values.lastName} · {values.email}
            </dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Where you are</dt>
            <dd className="text-sage">
              {labelFrom(medicationStages, values.stage)} ·{" "}
              {labelFrom(concernOptions, values.concern)}
            </dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Plan interest</dt>
            <dd className="text-sage">
              {chosenPlan ? `${chosenPlan.name} (sample $${chosenPlan.price})` : planLabel}
            </dd>
          </div>
          <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
            <dt className="font-semibold text-cocoa">Preferred call</dt>
            <dd className="text-sage">
              {values.day}, {values.timeWindow} · {values.timeZone}
            </dd>
          </div>
          {snapshot ? (
            <div className="grid gap-0.5 sm:grid-cols-[9rem_1fr] sm:gap-3">
              <dt className="font-semibold text-cocoa">Plate Check</dt>
              <dd className="text-sage">
                {snapshot.score}/100 · {snapshot.resultTitle}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-4 rounded-xl border border-wheat-deep bg-wheat p-4">
        <h3 className="font-serif text-lg text-sage">Next steps</h3>
        <ol className="mt-2 space-y-2 text-sm text-cocoa">
          <li>
            <span className="font-semibold text-sage">1. Within one business day</span> — an
            email with two or three call times and a short pre-call question.
          </li>
          <li>
            <span className="font-semibold text-sage">2. The free fit call</span> — 20
            minutes, video or phone. No card, no pressure to decide.
          </li>
          <li>
            <span className="font-semibold text-sage">3. Afterwards</span> — a written
            summary, a recommendation, and where to take any medication questions (your
            prescriber).
          </li>
        </ol>
      </div>

      <p className="mt-4 rounded-lg border border-clay-text/40 bg-clay-wash px-3 py-2 text-sm font-medium text-clay-text">
        <span className="font-semibold">{successDisclaimer}</span> This concept site does not
        submit, store or email your details — nothing leaves your browser.
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" className="btn btn-primary sm:flex-1" onClick={onClose}>
          Close
        </button>
        <a href="#plate-check" onClick={onClose} className="btn btn-secondary sm:flex-1">
          Take the Plate Check
        </a>
      </div>
    </div>
  );

  if (submitted) return success;

  return (
    <>
      <div className="border-b border-line px-5 pb-4 pt-6 sm:px-7">
            <p className="eyebrow pr-12">Free fit call · 20 minutes · No card needed</p>
            <h2
              id={titleId}
              className="mt-1 pr-12 font-serif text-2xl leading-snug text-sage sm:text-[1.75rem]"
            >
              Book a free fit call
            </h2>
            <p id={descriptionId} className="mt-1.5 pr-10 text-sm text-cocoa">
              Four short steps. We use this to make the call useful, not to qualify you out.
            </p>
            <div className="mt-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-deep">
                  Step {step} of 4
                </p>
                <p className="text-xs font-medium text-cocoa">{bookingSteps[step - 1]}</p>
              </div>
              <ol className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
                {bookingSteps.map((label, index) => (
                  <li
                    key={label}
                    className={`h-1.5 rounded-full ${index < step ? "bg-clay" : "bg-line"}`}
                  />
                ))}
              </ol>
              <div
                role="progressbar"
                aria-label="Booking progress"
                aria-valuemin={1}
                aria-valuemax={4}
                aria-valuenow={step}
                aria-valuetext={`Step ${step} of 4: ${bookingSteps[step - 1]}`}
                className="sr-only"
              />
            </div>
          </div>

          <div className="px-5 pb-5 pt-5 sm:px-7">
            <h3
              id={`${baseId}-step-heading`}
              ref={headingRef}
              tabIndex={-1}
              className="mb-4 font-serif text-xl text-sage"
            >
              {step === 1
                ? "First, where you are"
                : step === 2
                  ? "What you want from coaching"
                  : step === 3
                    ? "How to reach you, and when"
                    : "Check everything looks right"}
            </h3>
            {errorSummary}
            {step === 1 ? stepOne : null}
            {step === 2 ? stepTwo : null}
            {step === 3 ? stepThree : null}
            {step === 4 ? review : null}
          </div>

          <div className="sticky bottom-0 border-t border-line bg-cream px-5 pb-4 pt-3 sm:px-7">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button type="button" className="btn btn-secondary" onClick={goBack}>
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <span className="hidden sm:block" />
              )}
              {step < 4 ? (
                <button type="button" className="btn btn-primary" onClick={goNext}>
                  Next
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Request my call
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          <p className="mt-2 text-center text-xs text-cocoa sm:text-left">
            Demo form — nothing is sent or stored.
          </p>
        </div>
    </>
  );
}
