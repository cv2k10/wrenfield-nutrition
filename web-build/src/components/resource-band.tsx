"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BookOpenText, CheckCircle2, CircleAlert, Mail } from "lucide-react";
import { FUNNEL_OPTIONS } from "@/lib/data";
import { validateGuideForm, type GuideErrors, type GuideValues } from "@/lib/scoring";
import { withFallback } from "@/lib/image-fallback";

export function ResourceBand() {
  const [values, setValues] = useState<GuideValues>({ firstName: "", email: "", stage: "", consent: false });
  const [errors, setErrors] = useState<GuideErrors>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLSelectElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const focusFirstInvalid = (errs: GuideErrors) => {
    const targets: [keyof GuideErrors, () => HTMLElement | null][] = [
      ["firstName", () => firstNameRef.current],
      ["email", () => emailRef.current],
      ["stage", () => stageRef.current],
      ["consent", () => consentRef.current],
    ];
    for (const [key, getEl] of targets) {
      if (errs[key]) {
        window.requestAnimationFrame(() => getEl()?.focus());
        return;
      }
    }
  };

  const set = <K extends keyof GuideValues>(key: K, val: GuideValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const errs = validateGuideForm(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstInvalid(errs);
      return;
    }
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, website }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "We couldn't send the guide. Please try again.");
      }
      setDone(true);
    } catch (err) {
      setSendError(
        err instanceof TypeError
          ? "We couldn't reach the server. Check your connection and try again."
          : (err as Error).message
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="guide-heading" className="bg-wheat">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">
              <BookOpenText className="h-4 w-4 text-olive" aria-hidden="true" />
              Free one-page guide
            </p>
            <h2 id="guide-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              The GLP-1 Protein Plate Guide
            </h2>
            <p className="mt-4 max-w-lg text-sage-600">
              A printable one-pager: the protein-first plate layout, twelve small-appetite
              breakfast and snack builds, and a gentle-foods column for rough side-effect days.
              Yours for an email — real world, no spam, unsubscribe anytime.
            </p>
            <div className="mt-6 hidden max-w-md overflow-hidden rounded-2xl border border-wheat-deep shadow-md lg:block">
              <Image
                src="/images/guide.jpg"
                alt="A yogurt bowl with berries, granola, and nuts — the kind of small protein-first breakfast in the guide"
                width={1000}
                height={1500}
                loading="lazy"
                onError={withFallback}
                className="aspect-[8/5] w-full object-cover"
                sizes="(min-width: 1024px) 30rem, 100vw"
              />
            </div>
          </div>

          <div className="card p-6 sm:p-8">
            {done ? (
              <div className="py-6 text-center" role="status">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf/15">
                  <CheckCircle2 className="h-7 w-7 text-leaf-deep" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  The guide is on its way, {values.firstName.trim()}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sage-600">
                  We&apos;ll send it to{" "}
                  <strong className="text-sage-800">{values.email.trim()}</strong> shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary mt-5"
                  onClick={() => {
                    setDone(false);
                    setValues({ firstName: "", email: "", stage: "", consent: false });
                  }}
                >
                  Sign up someone else
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Get the free Protein Plate Guide">
                <p className="font-display text-xl font-semibold">Where should it go?</p>

                {Object.keys(errors).length > 0 && (
                  <div role="alert" className="mt-3 rounded-xl border border-ember/40 bg-terracotta/10 px-4 py-2.5 text-[0.95rem] font-semibold text-ember">
                    Please fix {Object.keys(errors).length}{" "}
                    {Object.keys(errors).length === 1 ? "field" : "fields"} below.
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="g-firstName" className="field-label">
                      First name <span aria-hidden="true" className="text-ember">*</span>
                    </label>
                    <input
                      ref={firstNameRef}
                      id="g-firstName"
                      type="text"
                      autoComplete="given-name"
                      className="field-input"
                      value={values.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      aria-invalid={!!errors.firstName}
                      aria-describedby={errors.firstName ? "g-firstName-error" : undefined}
                      required
                    />
                    {errors.firstName && (
                      <p id="g-firstName-error" className="field-error">
                        <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="g-email" className="field-label">
                      Email <span aria-hidden="true" className="text-ember">*</span>
                    </label>
                    <input
                      ref={emailRef}
                      id="g-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      className="field-input"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "g-email-error" : undefined}
                      required
                    />
                    {errors.email && (
                      <p id="g-email-error" className="field-error">
                        <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="g-stage" className="field-label">
                      Where are you now? <span aria-hidden="true" className="text-ember">*</span>
                    </label>
                    <select
                      ref={stageRef}
                      id="g-stage"
                      className="field-input"
                      value={values.stage}
                      onChange={(e) => set("stage", e.target.value)}
                      aria-invalid={!!errors.stage}
                      aria-describedby={errors.stage ? "g-stage-error" : undefined}
                    >
                      <option value="">Choose one…</option>
                      {FUNNEL_OPTIONS.stages.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {errors.stage && (
                      <p id="g-stage-error" className="field-error">
                        <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                        {errors.stage}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        ref={consentRef}
                        type="checkbox"
                        className="mt-1 h-5 w-5"
                        checked={values.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        aria-invalid={!!errors.consent}
                        aria-describedby={errors.consent ? "g-consent-error" : undefined}
                      />
                      <span className="text-[0.95rem] leading-snug">
                        I agree to receive the guide and an occasional note from Wrenfield Nutrition.
                        <span aria-hidden="true" className="text-ember"> *</span>{" "}
                        <span className="text-sage-600">Unsubscribe anytime.</span>
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="g-consent-error" className="field-error">
                        <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {sendError && (

                    <p role="alert" className="field-error">

                      <CircleAlert className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />

                      {sendError}

                    </p>

                  )}

                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" value={website} onChange={(e) => setWebsite(e.target.value)} />

                  <button type="submit" className="btn btn-primary w-full" disabled={sending} aria-busy={sending}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {sending ? "Sending…" : "Send me the guide"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
