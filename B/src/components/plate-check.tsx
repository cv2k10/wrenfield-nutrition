"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardCheck, RotateCcw, Sparkles } from "lucide-react";
import { PLATE_DISCLAIMER, PLATE_QUESTIONS, PLANS } from "@/lib/data";
import { scorePlateCheck, type PlateResult } from "@/lib/scoring";
import { useFunnel } from "./funnel-context";

const TOTAL = PLATE_QUESTIONS.length; // 7

function tierColor(score: number) {
  if (score < 50) return "var(--color-ember)";
  if (score < 75) return "var(--color-olive-deep)";
  return "var(--color-leaf-deep)";
}

export function PlateCheck() {
  const { openBooking, plateResult, setPlateResult } = useFunnel();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<PlateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [barsIn, setBarsIn] = useState(false);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  // If a result was computed earlier (context holds it), restore view
  useEffect(() => {
    if (plateResult && !result && Object.keys(answers).length === TOTAL) return;
  }, [plateResult, result, answers]);

  useEffect(() => {
    if (result) {
      resultHeadingRef.current?.focus();
      setBarsIn(false);
      const t = window.setTimeout(() => setBarsIn(true), 60);
      return () => window.clearTimeout(t);
    }
  }, [result]);

  const q = PLATE_QUESTIONS[index];
  const selected = answers[q?.id ?? ""];

  const choose = (value: string) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    setError(null);
  };

  const next = () => {
    if (!selected) {
      setError("Choose the answer closest to your life right now — there are no wrong answers.");
      return;
    }
    setError(null);
    if (index < TOTAL - 1) {
      setIndex((i) => i + 1);
      if (liveRef.current) liveRef.current.textContent = `Question ${index + 2} of ${TOTAL}`;
    } else {
      const r = scorePlateCheck(answers);
      if (r) {
        setResult(r);
        setPlateResult(r);
      }
    }
  };

  const back = () => {
    setError(null);
    setIndex((i) => Math.max(0, i - 1));
  };

  const retake = () => {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setError(null);
    setBarsIn(false);
  };

  const plan = result ? PLANS.find((p) => p.id === result.recommendedPlan) : null;

  return (
    <section id="plate-check" aria-labelledby="pc-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">
            <Sparkles className="h-4 w-4 text-olive" aria-hidden="true" />
            The Plate Check · 2 minutes
          </p>
          <h2 id="pc-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Is your plate keeping up with your appetite?
          </h2>
          <p className="mt-4 text-sage-600">
            Seven honest questions about how you&apos;re actually eating. You&apos;ll get a score
            out of 100, your three weakest spots, and a plan suggestion to match.
          </p>
        </div>

        <div className="card mx-auto mt-10 max-w-3xl overflow-hidden">
          {!result ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              className="flex flex-col"
              aria-label="Plate Check assessment"
            >
              {/* Progress */}
              <div className="border-b border-sage-200 px-5 pb-4 pt-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-sage-700">
                    Question {index + 1} of {TOTAL}
                  </p>
                  <p className="text-sm text-sage-600" aria-hidden="true">
                    {Math.round(((index + (selected ? 1 : 0)) / TOTAL) * 100)}%
                  </p>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-sage-100"
                  role="progressbar"
                  aria-valuenow={index + 1}
                  aria-valuemin={1}
                  aria-valuemax={TOTAL}
                  aria-label={`Plate Check progress: question ${index + 1} of ${TOTAL}`}
                >
                  <div
                    className="h-full rounded-full bg-olive-deep transition-all duration-300"
                    style={{ width: `${(index / TOTAL) * 100 + (selected ? 100 / TOTAL : 0)}%` }}
                  />
                </div>
                <p ref={liveRef} className="sr-only" aria-live="polite" />
              </div>

              {/* Question */}
              <fieldset className="px-5 py-6 sm:px-8">
                <legend className="font-display text-xl font-semibold leading-snug text-sage-800 sm:text-2xl">
                  {q.question}
                </legend>
                <div className="mt-4 space-y-2" role="radiogroup" aria-label={q.question}>
                  {q.options.map((o) => {
                    const checked = selected === o.value;
                    return (
                      <label
                        key={o.value}
                        className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:border-sage-700 ${
                          checked
                            ? "border-ember bg-terracotta/10 shadow-[0_0_0_1px_var(--color-ember)]"
                            : "border-sage-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={o.value}
                          checked={checked}
                          onChange={() => choose(o.value)}
                          className="h-5 w-5 flex-none"
                          aria-invalid={!!error}
                          aria-describedby={error ? "pc-error" : undefined}
                        />
                        <span>
                          <span className="block font-semibold text-sage-800">{o.label}</span>
                          {o.hint && (
                            <span className="block text-[0.95rem] text-sage-600">{o.hint}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {error && (
                  <p id="pc-error" className="field-error mt-3">
                    {error}
                  </p>
                )}
              </fieldset>

              {/* Controls */}
              <div className="flex items-center justify-between gap-3 border-t border-sage-200 bg-cream-deep/60 px-5 py-4 sm:px-8">
                {index > 0 ? (
                  <button type="button" onClick={back} className="btn btn-secondary">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </button>
                ) : (
                  <span className="text-sm text-sage-600">Answer honestly — it&apos;s just for you.</span>
                )}
                <button type="submit" className="btn btn-primary">
                  {index === TOTAL - 1 ? (
                    <>
                      See my result
                      <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="px-5 py-8 sm:px-10" role="status">
              {/* Focus target + announcement */}
              <h3
                ref={resultHeadingRef}
                tabIndex={-1}
                className="text-center font-display text-3xl font-semibold focus:outline-none"
              >
                Your result: <span className="italic text-terracotta">{result.tier.name}</span>
              </h3>

              {/* Score ring */}
              <div className="mt-6 flex justify-center">
                <div className="relative h-40 w-40">
                  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-sage-100)" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={tierColor(result.score)}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - (barsIn ? result.score : 0) / 100)}
                      transform="rotate(-90 60 60)"
                      style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-4xl font-bold" style={{ color: tierColor(result.score) }}>
                      <span className="sr-only">Your Plate Check score is </span>
                      {result.score}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-sage-600">
                      out of 100
                    </span>
                  </div>
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-xl text-center text-sage-700">
                <strong className="text-sage-800">{result.tier.headline}</strong>{" "}
                {result.tier.explanation}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Weakest areas */}
                <div className="rounded-2xl border border-sage-200 bg-white/70 p-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                    Your 3 weakest areas
                  </h4>
                  <ul className="mt-4 space-y-4">
                    {result.weakest.map((w) => (
                      <li key={w.key}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-semibold text-sage-800">{w.label}</span>
                          <span className="text-sm font-bold text-sage-600">{w.pct}%</span>
                        </div>
                        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-wheat">
                          <div
                            className="h-full rounded-full bg-sage-700"
                            style={{
                              width: barsIn ? `${Math.max(w.pct, 2)}%` : "0%",
                              transition: "width 800ms cubic-bezier(0.22,1,0.36,1)",
                            }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next steps */}
                <div className="rounded-2xl border border-sage-200 bg-white/70 p-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                    3 next steps
                  </h4>
                  <ol className="mt-4 space-y-3">
                    {result.tier.nextSteps.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-wheat font-display text-sm font-bold text-sage-800"
                        >
                          {i + 1}
                        </span>
                        <span className="text-[0.98rem] text-sage-700">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Recommended plan + CTA */}
              {plan && (
                <div className="mt-6 rounded-2xl border border-ember/30 bg-wheat/70 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-ember">
                      Suggested starting point
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold text-sage-800">
                      {plan.name} <span className="text-base font-normal text-sage-600">· {plan.length} · {plan.sessions} · {plan.price} sample</span>
                    </p>
                    <p className="mt-1 text-[0.95rem] text-sage-600">{plan.summary}</p>
                  </div>
                  <a
                    href="#plans"
                    className="mt-4 inline-flex min-h-[44px] flex-none items-center font-semibold text-ember underline decoration-2 underline-offset-4 hover:text-ember-deep sm:mt-0"
                  >
                    Compare plans
                  </a>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openBooking({ plan: result.recommendedPlan })}
                  className="btn btn-primary"
                >
                  Bring my Plate Check to a free call
                </button>
                <button type="button" onClick={retake} className="btn btn-secondary">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Retake
                </button>
              </div>
            </div>
          )}

          <p className="border-t border-sage-200 bg-cream-deep/60 px-5 py-3.5 text-center text-sm text-sage-600 sm:px-8">
            {PLATE_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
}
