"use client";

import { useState } from "react";
import {
  planComparison,
  plans,
  pricingNote,
  type PlanId,
} from "@/content/site";
import { useFunnel } from "./funnel-context";
import {
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  LeafSprig,
  SectionHeading,
} from "./brand";
import { Dialog } from "./dialog";

export function Plans() {
  const { openBooking } = useFunnel();
  const [selectedId, setSelectedId] = useState<PlanId | null>(null);
  const selected = plans.find((plan) => plan.id === selectedId) ?? null;
  const titleId = "plan-dialog-title";

  const choosePlan = (planId: PlanId) => {
    setSelectedId(null);
    window.setTimeout(() => openBooking({ planId }), 60);
  };

  return (
    <section
      id="plans"
      aria-labelledby="plans-title"
      className="scroll-mt-24 border-y border-line bg-cream-deep py-16 md:py-24"
    >
      <div className="container-editorial">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="plans-title"
            eyebrow="Plans · sample pricing"
            title="Pick a starting point, not a year-long contract."
            intro={
              <p>
                Three ways to work together, each with a written plate plan and one-to-one video
                sessions. Prices below are samples for this concept site, not real fees.
              </p>
            }
          />
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-wheat-deep bg-wheat px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-olive-deep">
            <InfoIcon className="h-3.5 w-3.5" />
            Sample prices
          </span>
        </div>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const featured = plan.id === "steady-strength";
            return (
              <li key={plan.id} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl border bg-cream p-5 sm:p-6 ${
                    featured
                      ? "border-sage shadow-lift lg:-mt-3 lg:mb-3"
                      : "border-line shadow-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-[1.5rem] leading-tight text-sage">{plan.name}</h3>
                    {plan.badge ? (
                      <span className="rounded-full bg-sage px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-cream">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm font-medium text-cocoa">
                    {plan.duration} · {plan.sessions}
                  </p>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="font-serif text-[2.35rem] leading-none text-sage">
                      ${plan.price}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-olive-deep">
                      sample price
                    </span>
                  </p>
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-cocoa">{plan.who}</p>
                  <ul className="mt-4 space-y-2">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[1rem] leading-snug text-sage">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-leaf-deep" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-col gap-2 pt-5">
                    <button
                      type="button"
                      className={featured ? "btn btn-primary w-full" : "btn btn-secondary w-full"}
                      onClick={() => openBooking({ planId: plan.id })}
                    >
                      Book a free fit call
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost w-full"
                      onClick={() => setSelectedId(plan.id)}
                      aria-haspopup="dialog"
                    >
                      See details
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-9 rounded-2xl border border-line bg-cream p-4 sm:p-5">
          <h3 className="font-serif text-[1.35rem] text-sage">Compare the plans</h3>
          <div className="mt-3 hidden md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Comparison of Wrenfield Nutrition plans, including sample prices
              </caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="py-2.5 pr-4 font-semibold text-cocoa">
                    What is included
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} scope="col" className="py-2.5 pr-4 font-serif text-[1rem] text-sage">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planComparison.rows.map((row) => (
                  <tr key={row.label} className="border-b border-line/70 last:border-0">
                    <th scope="row" className="py-2.5 pr-4 font-medium text-cocoa">
                      {row.label}
                    </th>
                    {plans.map((plan) => (
                      <td key={plan.id} className="py-2.5 pr-4 text-sage">
                        {row.values[plan.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="grid gap-3 md:hidden">
            {plans.map((plan) => (
              <li key={plan.id} className="rounded-xl border border-line bg-white/70 p-4">
                <h4 className="font-serif text-[1.15rem] text-sage">{plan.name}</h4>
                <dl className="mt-2 space-y-1.5">
                  {planComparison.rows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 border-b border-line/60 pb-1.5 last:border-0 last:pb-0">
                      <dt className="text-sm text-cocoa">{row.label}</dt>
                      <dd className="text-right text-sm font-medium text-sage">
                        {row.values[plan.id]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 text-sm leading-relaxed text-cocoa">
            <p>{pricingNote.sampleNotice}</p>
            <p>{pricingNote.payment}</p>
            <p>{pricingNote.hsa}</p>
          </div>
        </div>

        <p className="mt-5 flex items-start gap-2 text-sm text-cocoa">
          <LeafSprig className="mt-0.5 h-4 w-8 shrink-0 text-olive" />
          Not sure which plan fits? The free fit call exists for exactly that, and we will recommend
          the smaller option if it is the better one.
        </p>
      </div>

      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelectedId(null)}
        labelledBy={titleId}
        closeLabel="Close plan details"
        size="lg"
      >
        {selected ? (
          <div className="px-5 pb-6 pt-7 sm:px-7">
            <p className="eyebrow pr-14">
              Plan details · {selected.duration} · sample price ${selected.price}
            </p>
            <h2 id={titleId} className="mt-1 pr-14 font-serif text-[1.8rem] leading-tight text-sage">
              {selected.name}
              {selected.badge ? (
                <span className="ml-2 align-middle text-[0.62rem] font-sans font-semibold uppercase tracking-[0.1em] text-olive-deep">
                  {selected.badge}
                </span>
              ) : null}
            </h2>
            <p className="mt-2 text-[0.98rem] leading-relaxed text-cocoa">{selected.who}</p>

            <div className="mt-5">
              <h3 className="font-serif text-[1.2rem] text-sage">Session by session</h3>
              <ol className="mt-2.5 space-y-3">
                {selected.outline.map((item) => (
                  <li key={item.label} className="rounded-xl border border-line bg-white/70 p-3.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-olive-deep">
                      {item.label}
                    </p>
                    <p className="mt-0.5 font-serif text-[1.05rem] text-sage">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cocoa">{item.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-olive/30 bg-sage-wash p-4">
                <h3 className="font-serif text-[1.1rem] text-sage">What you leave with</h3>
                <ul className="mt-2 space-y-1.5">
                  {selected.leaveWith.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-cocoa">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-leaf-deep" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-wheat-deep bg-wheat p-4">
                <h3 className="font-serif text-[1.1rem] text-sage">What it asks of you</h3>
                <ul className="mt-2 space-y-1.5">
                  {selected.asksOfYou.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-cocoa">
                      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olive" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-cocoa">
              <span className="font-semibold text-sage">Best for:</span> {selected.bestFor}
            </p>
            <p className="mt-2 rounded-lg border border-line bg-cream-deep px-3 py-2 text-xs leading-relaxed text-cocoa">
              {pricingNote.sampleNotice} {pricingNote.hsa}
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                className="btn btn-primary sm:flex-1"
                onClick={() => choosePlan(selected.id)}
              >
                Book a free fit call about {selected.name}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedId(null)}
              >
                Keep comparing
              </button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
