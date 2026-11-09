"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  plans,
  quizQuestions,
  scorePlateCheck,
  type PlateCheckOutcome,
} from "@/content/site";
import { useFunnel } from "./funnel-context";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  LeafSprig,
  PlateDivider,
  SectionHeading,
} from "./brand";

export function PlateCheck() {
  const { openBooking } = useFunnel();
  const baseId = useId();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [outcome, setOutcome] = useState<PlateCheckOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const firstOptionRef = useRef<HTMLInputElement | null>(null);
  const prevIndexRef = useRef(index);
  const hasResultRef = useRef(false);

  const question = quizQuestions[index];
  const answered = answers[question.id] !== undefined;
  const questionId = `${baseId}-q-${question.id}`;
  const isLast = index === quizQuestions.length - 1;

  useEffect(() => {
    if (prevIndexRef.current !== index) {
      questionHeadingRef.current?.focus();
    }
    prevIndexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (outcome && !hasResultRef.current) {
      resultHeadingRef.current?.focus();
    }
    hasResultRef.current = Boolean(outcome);
  }, [outcome]);

  const choose = (optionIndex: number) => {
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
    setError(null);
  };

  const goNext = () => {
    if (!answered) {
      setError("Choose the answer that fits best — a rough guess is fine.");
      firstOptionRef.current?.focus();
      return;
    }
    if (isLast) {
      setOutcome(scorePlateCheck(answers));
      return;
    }
    setIndex((current) => current + 1);
  };

  const goBack = () => {
    setError(null);
    setIndex((current) => Math.max(0, current - 1));
  };

  const retake = () => {
    setAnswers({});
    setOutcome(null);
    setIndex(0);
    setError(null);
    window.setTimeout(() => questionHeadingRef.current?.focus(), 60);
  };

  const progress = outcome ? 100 : Math.round(((index + (answered ? 1 : 0)) / quizQuestions.length) * 100);
  const recommended = outcome ? plans.find((plan) => plan.id === outcome.planId) : null;

  return (
    <section id="plate-check" aria-labelledby="plate-check-title" className="scroll-mt-24 bg-cream py-16 md:py-24">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="plate-check-title"
              eyebrow="Plate Check · 2 minutes"
              title="Where is your plate actually strong — and where is it slipping?"
              intro={
                <p>
                  Seven quick questions about how you are eating right now. You get a score out of
                  100, the three areas most worth your attention, and a starting plan. No email
                  required.
                </p>
              }
            />
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-line bg-white/70 p-4 text-sm text-cocoa">
              <InfoIcon className="mt-0.5 h-4 w-4 text-olive-deep" />
              <p>
                This is a self-reflection tool, not medical advice or a diagnosis. It does not
                assess your medication, and it cannot tell you whether a symptom is safe to wait
                out. Talk with your prescriber about symptoms.
              </p>
            </div>
            <div className="mt-6 hidden items-end gap-3 lg:flex" aria-hidden="true">
              <LeafSprig className="h-12 w-24 text-olive" />
              <PlateDivider className="h-8 w-40" />
            </div>
          </div>

          <div className="relative">
            <div className="card-soft overflow-hidden">
              <div className="border-b border-line bg-wheat/70 px-5 py-4 sm:px-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-deep">
                    {outcome ? "Your result" : `Question ${index + 1} of ${quizQuestions.length}`}
                  </p>
                  <p className="text-xs font-medium text-cocoa">
                    {outcome ? "Self-reflection, not medical advice" : "About 2 minutes"}
                  </p>
                </div>
                <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream">
                  <div
                    className="h-full rounded-full bg-olive transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div
                  className="sr-only"
                  role="progressbar"
                  aria-label="Plate Check progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                />
              </div>

              <div className="px-5 py-6 sm:px-7 sm:py-7">
                <div aria-live="polite" role="status" className="sr-only">
                  {outcome
                    ? `Plate Check complete. Score ${outcome.score} out of 100. Result: ${outcome.result.title}.`
                    : `Question ${index + 1} of ${quizQuestions.length}: ${question.prompt}`}
                </div>

                {outcome ? (
                  <div>
                    <h3
                      ref={resultHeadingRef}
                      tabIndex={-1}
                      className="font-serif text-[clamp(1.6rem,3.4vw,2.1rem)] leading-tight text-sage"
                    >
                      {outcome.result.title}
                    </h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
                      Score band {outcome.result.band}
                    </p>

                    <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="relative mx-auto h-[7.5rem] w-[7.5rem] shrink-0 sm:mx-0">
                        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                          <circle cx="60" cy="60" r="52" fill="none" stroke="#E6D7BA" strokeWidth="10" />
                          <circle
                            cx="60"
                            cy="60"
                            r="52"
                            fill="none"
                            stroke="#B0522F"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 52}
                            strokeDashoffset={2 * Math.PI * 52 * (1 - outcome.score / 100)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="font-serif text-4xl leading-none text-sage">{outcome.score}</span>
                          <span className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-olive-deep">
                            out of 100
                          </span>
                        </div>
                      </div>
                      <p className="text-[1.0625rem] leading-relaxed text-cocoa">
                        {outcome.result.explanation}
                      </p>
                    </div>

                    <div className="mt-6 rounded-xl border border-line bg-cream-deep/60 p-4">
                      <h4 className="font-serif text-lg text-sage">Your three focus areas</h4>
                      <p className="mt-1 text-sm text-cocoa">
                        Scored from your answers, lowest first. Progress in any one of these usually
                        lifts the others.
                      </p>
                      <ul className="mt-3 space-y-3">
                        {outcome.weakest.map((area) => (
                          <li key={area.id}>
                            <div className="flex items-baseline justify-between gap-3 text-sm">
                              <span className="font-semibold text-sage">{area.label}</span>
                              <span className="text-cocoa">{area.percent}%</span>
                            </div>
                            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-wheat">
                              <div
                                className="h-full rounded-full bg-clay"
                                style={{ width: `${Math.max(area.percent, 3)}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-serif text-lg text-sage">Three next steps</h4>
                      <ol className="mt-2 space-y-2">
                        {outcome.result.nextSteps.map((step, stepIndex) => (
                          <li key={step} className="flex items-start gap-3 text-[1.0625rem] text-cocoa">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-semibold text-cream">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {recommended ? (
                      <div className="mt-6 rounded-xl border border-olive/40 bg-sage-wash p-4">
                        <p className="eyebrow">Recommended starting point</p>
                        <p className="mt-1 font-serif text-xl text-sage">{recommended.name}</p>
                        <p className="mt-1 text-sm text-cocoa">
                          {recommended.duration} · {recommended.sessions} · sample ${recommended.price}.{" "}
                          {recommended.who}
                        </p>
                      </div>
                    ) : null}

                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        className="btn btn-primary sm:flex-1"
                        onClick={() =>
                          openBooking({
                            plateCheck: {
                              score: outcome.score,
                              resultTitle: outcome.result.title,
                              planId: outcome.planId,
                            },
                            planId: outcome.planId,
                          })
                        }
                      >
                        Bring my Plate Check to a free call
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={retake}>
                        Retake the Plate Check
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-cocoa">
                      Your score, result and recommended plan travel with you into the booking form.
                    </p>
                  </div>
                ) : (
                  <div>
                    <fieldset aria-describedby={`${questionId}-help`}>
                      <legend className="w-full">
                        <span ref={questionHeadingRef} tabIndex={-1} className="block font-serif text-[1.4rem] leading-snug text-sage outline-none sm:text-[1.55rem]">
                          {question.prompt}
                        </span>
                      </legend>
                      <p id={`${questionId}-help`} className="mt-2 text-sm text-cocoa">
                        {question.help ?? "Choose the answer that fits best."}
                      </p>
                      <div className="mt-4 space-y-2.5">
                        {question.options.map((option, optionIndex) => (
                          <label key={option.label} className="choice">
                            <input
                              ref={optionIndex === 0 ? firstOptionRef : undefined}
                              type="radio"
                              name={`plate-${question.id}`}
                              value={optionIndex}
                              checked={answers[question.id] === optionIndex}
                              onChange={() => choose(optionIndex)}
                              aria-describedby={error ? `${questionId}-error` : undefined}
                            />
                            <span>
                              <span className="block font-semibold text-sage">{option.label}</span>
                              {option.detail ? (
                                <span className="block text-sm text-cocoa">{option.detail}</span>
                              ) : null}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div id={`${questionId}-error`} aria-live="assertive" className="min-h-0">
                      {error ? (
                        <p className="mt-3 rounded-lg border border-clay-text/40 bg-clay-wash px-3 py-2 text-sm font-medium text-clay-text">
                          {error}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        className="btn btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={goBack}
                        disabled={index === 0}
                        aria-disabled={index === 0}
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Back
                      </button>
                      <button type="button" className="btn btn-primary" onClick={goNext}>
                        {isLast ? "See my results" : "Next question"}
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-cocoa">
                      No email required. Nothing is stored — your answers stay in this browser tab.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!outcome ? (
              <p className="mt-3 flex items-start gap-2 text-xs text-cocoa">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 text-leaf-deep" />
                Use the arrow keys to move between answers, or tap one. Seven questions, then your
                result.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
