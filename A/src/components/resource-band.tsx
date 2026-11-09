"use client";

import { useId, useRef, useState } from "react";
import { resourceStages } from "@/content/site";
import { CheckIcon, InfoIcon, LeafSprig, WrenMark } from "./brand";

type GuideErrors = {
  firstName?: string;
  email?: string;
  stage?: string;
  consent?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ResourceBand() {
  const baseId = useId();
  const [values, setValues] = useState({ firstName: "", email: "", stage: "", consent: false });
  const [errors, setErrors] = useState<GuideErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const ids: Record<keyof GuideErrors, string> = {
    firstName: `${baseId}-firstName`,
    email: `${baseId}-email`,
    stage: `${baseId}-stage`,
    consent: `${baseId}-consent`,
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: GuideErrors = {};
    if (!values.firstName.trim()) nextErrors.firstName = "Add a first name so the guide is addressed properly.";
    if (!values.email.trim()) {
      nextErrors.email = "Enter an email address.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter an email in the format name@example.com.";
    }
    if (!values.stage) nextErrors.stage = "Choose where you are right now.";
    if (!values.consent) nextErrors.consent = "Tick the box to confirm you would like the guide.";
    setErrors(nextErrors);

    const firstKey = (Object.keys(ids) as (keyof GuideErrors)[]).find((key) => nextErrors[key]);
    if (firstKey) {
      document.getElementById(ids[firstKey])?.focus();
      return;
    }
    setSubmitted(true);
  };

  const errorFor = (key: keyof GuideErrors) =>
    errors[key] ? (
      <p id={`${ids[key]}-error`} className="mt-1.5 text-sm font-medium text-clay-text">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section aria-labelledby="guide-title" className="border-y border-wheat-deep bg-wheat py-16 md:py-20">
      <div className="container-editorial">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <LeafSprig className="h-4 w-8 text-olive-deep" />
              Free resource · no upsell
            </p>
            <h2
              id="guide-title"
              className="mt-2 font-serif text-[clamp(1.85rem,4.4vw,2.7rem)] leading-[1.1] text-sage"
            >
              The GLP-1 Protein Plate Guide
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-cocoa">
              A short, practical PDF for anyone whose appetite has shrunk faster than their
              shopping list. Food only, written in plain language.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                "Seven protein-first plates built from ordinary groceries",
                "A snack list for days when nothing sounds good",
                "How to build a plate when portions are tiny",
                "A note on what to take to your prescriber, not what to ask us",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[1.0625rem] text-sage">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream text-leaf-deep">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-start gap-2 text-sm text-cocoa">
              <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-olive-deep" />
              No supplements, no affiliate links, and no medical advice inside.
            </p>
          </div>

          <div className="rounded-2xl border border-wheat-deep bg-cream p-5 shadow-card sm:p-6">
            {submitted ? (
              <div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-wash text-leaf-deep">
                    <CheckIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="eyebrow">Demo success state</p>
                    <h3 className="mt-1 font-serif text-[1.45rem] leading-snug text-sage">
                      Thanks, {values.firstName.trim()} — the guide would be on its way.
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-cocoa">
                  In a real practice, you would receive the PDF at{" "}
                  <span className="font-semibold text-sage">{values.email.trim()}</span> within a few
                  minutes, followed by one short note about the free fit call — and nothing else
                  unless you ask.
                </p>
                <div className="mt-4 rounded-xl border border-wheat-deep bg-wheat p-3.5 text-sm leading-relaxed text-cocoa">
                  <p className="font-semibold text-sage">Demo only: no email has been sent.</p>
                  <p className="mt-1">
                    This concept site does not submit or store form data. Nothing was saved.
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    className="btn btn-primary sm:flex-1"
                    onClick={() => {
                      setSubmitted(false);
                      setValues({ firstName: "", email: "", stage: "", consent: false });
                    }}
                  >
                    Use a different email
                  </button>
                  <a href="#plate-check" className="btn btn-secondary sm:flex-1">
                    Try the Plate Check
                  </a>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="flex items-center gap-2.5">
                  <WrenMark className="h-6 w-6 text-sage" />
                  <h3 className="font-serif text-[1.35rem] leading-snug text-sage">
                    Send me the guide
                  </h3>
                </div>
                <div aria-live="polite" className="min-h-0">
                  {Object.keys(errors).length > 0 ? (
                    <p className="mt-3 rounded-lg border border-clay-text/40 bg-clay-wash px-3 py-2 text-sm font-medium text-clay-text">
                      Please check the highlighted fields below.
                    </p>
                  ) : null}
                </div>

                <div className="mt-3.5 space-y-4">
                  <div>
                    <label htmlFor={ids.firstName} className="field-label">
                      First name <span className="text-clay-text">*</span>
                    </label>
                    <input
                      id={ids.firstName}
                      name="guide-first-name"
                      type="text"
                      autoComplete="given-name"
                      className="field-control"
                      value={values.firstName}
                      onChange={(event) => {
                        setValues((current) => ({ ...current, firstName: event.target.value }));
                        setErrors((current) => ({ ...current, firstName: undefined }));
                      }}
                      aria-invalid={Boolean(errors.firstName)}
                      aria-describedby={errors.firstName ? `${ids.firstName}-error` : undefined}
                      required
                    />
                    {errorFor("firstName")}
                  </div>

                  <div>
                    <label htmlFor={ids.email} className="field-label">
                      Email <span className="text-clay-text">*</span>
                    </label>
                    <input
                      id={ids.email}
                      name="guide-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className="field-control"
                      value={values.email}
                      onChange={(event) => {
                        setValues((current) => ({ ...current, email: event.target.value }));
                        setErrors((current) => ({ ...current, email: undefined }));
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                      required
                    />
                    {errorFor("email")}
                  </div>

                  <div>
                    <label htmlFor={ids.stage} className="field-label">
                      Where are you now? <span className="text-clay-text">*</span>
                    </label>
                    <select
                      id={ids.stage}
                      name="guide-stage"
                      className="field-control"
                      value={values.stage}
                      onChange={(event) => {
                        setValues((current) => ({ ...current, stage: event.target.value }));
                        setErrors((current) => ({ ...current, stage: undefined }));
                      }}
                      aria-invalid={Boolean(errors.stage)}
                      aria-describedby={errors.stage ? `${ids.stage}-error` : undefined}
                      required
                    >
                      <option value="">Choose one</option>
                      {resourceStages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                    {errorFor("stage")}
                  </div>

                  <div>
                    <label htmlFor={ids.consent} className="choice items-start">
                      <input
                        id={ids.consent}
                        name="guide-consent"
                        type="checkbox"
                        checked={values.consent}
                        onChange={(event) => {
                          setValues((current) => ({ ...current, consent: event.target.checked }));
                          setErrors((current) => ({ ...current, consent: undefined }));
                        }}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
                        required
                      />
                      <span className="text-sm leading-snug text-sage">
                        Email me the guide and occasional food notes. Unsubscribe any time.
                        <span className="text-clay-text"> *</span>
                      </span>
                    </label>
                    {errorFor("consent")}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-4 w-full">
                  Send me the free guide
                </button>
                <p className="mt-2 text-center text-xs leading-relaxed text-cocoa">
                  Demo form: nothing is sent or stored. We never sell your details.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
