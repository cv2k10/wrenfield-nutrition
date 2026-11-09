"use client";

import { useState } from "react";
import { ArrowRight, Check, HandCoins, Info, Minus } from "lucide-react";
import { HSA_NOTE, PLANS, type Plan } from "@/lib/data";
import { AccessibleDialog } from "./dialog";
import { useFunnel } from "./funnel-context";

export function Plans() {
  const { openBooking } = useFunnel();
  const [detail, setDetail] = useState<Plan | null>(null);

  return (
    <section id="plans" aria-labelledby="plans-heading" className="scroll-mt-24 bg-wheat">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <HandCoins className="h-4 w-4 text-olive" aria-hidden="true" />
            Plans &amp; sample pricing
          </p>
          <h2 id="plans-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Three ways in — all prices on the table
          </h2>
          <p className="mt-4 text-sage-600">
            Every price below is a sample for this concept site, and you&apos;ll never be asked to
            pay on a fit call. Coaching is by video; your medication stays with your prescriber.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.id}
              className={`card relative flex flex-col p-6 ${
                p.badge ? "border-2 border-olive-deep shadow-[0_20px_48px_-24px_rgb(90_104_57/0.5)]" : ""
              }`}
              aria-labelledby={`plan-${p.id}-name`}
            >
              {p.badge && (
                <span className="absolute -top-3.5 left-6 rounded-full bg-olive-deep px-3 py-1 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-cream">
                  {p.badge}
                </span>
              )}
              <h3 id={`plan-${p.id}-name`} className="mt-2 font-display text-2xl font-semibold text-sage-800">
                {p.name}
              </h3>
              <p className="mt-1 text-[0.95rem] font-semibold text-sage-600">
                {p.length} · {p.sessions}
              </p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-sage-800">{p.price}</span>
                <span className="text-sm font-semibold text-sage-600">sample price</span>
              </p>
              <p className="mt-3 border-t border-sage-200 pt-3 text-[0.95rem] text-sage-700">
                <strong className="text-sage-800">Who it&apos;s for:</strong> {p.audience}
              </p>
              <ul className="mt-3 space-y-1.5 text-[0.95rem] text-sage-700">
                {p.includes
                  .filter((i) => i.included)
                  .slice(0, 4)
                  .map((i) => (
                    <li key={i.label} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 flex-none text-leaf-deep" aria-hidden="true" />
                      {i.label}
                    </li>
                  ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <button type="button" onClick={() => setDetail(p)} className="btn btn-secondary flex-1">
                  See details
                </button>
                <button
                  type="button"
                  onClick={() => openBooking({ plan: p.id })}
                  className="btn btn-primary flex-1"
                  aria-label={`Book a free fit call about the ${p.name} plan`}
                >
                  Free call
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Comparison: table on desktop, stacked cards on mobile */}
        <div className="mt-14">
          <h3 className="font-display text-2xl font-semibold">Side by side</h3>

          <div className="card mt-5 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse text-left text-[0.95rem]">
              <caption className="sr-only">
                Comparison of Fresh Start, Steady Strength, and Taper &amp; Maintain plans
              </caption>
              <thead>
                <tr className="border-b border-sage-200 bg-cream-deep/70">
                  <th scope="col" className="px-5 py-3.5 font-display text-lg font-semibold text-sage-800">
                    What&apos;s included
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className="px-4 py-3.5 font-display text-lg font-semibold text-sage-800">
                      {p.name}
                      <span className="block text-sm font-normal text-sage-600">
                        {p.length} · {p.price} sample
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-100">
                <tr className="bg-wheat/50">
                  <th scope="row" className="px-5 py-3 font-semibold text-sage-700">
                    Length &amp; live sessions
                  </th>
                  {PLANS.map((p) => (
                    <td key={p.id} className="px-4 py-3 text-sage-700">
                      {p.length} · {p.sessions}
                    </td>
                  ))}
                </tr>
                {PLANS[0].includes.map((row, ri) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-5 py-3 font-semibold text-sage-700">
                      {row.label}
                    </th>
                    {PLANS.map((p) => {
                      const included = p.includes[ri].included;
                      return (
                        <td key={p.id} className="px-4 py-3">
                          {included ? (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-leaf-deep">
                              <Check className="h-4.5 w-4.5" aria-hidden="true" />
                              Included
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-sage-600">
                              <Minus className="h-4 w-4" aria-hidden="true" />
                              Not included
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stacked cards for small screens */}
          <div className="mt-5 space-y-4 md:hidden">
            {PLANS.map((p) => (
              <article key={p.id} className="card p-5" aria-label={`${p.name} comparison`}>
                <h4 className="font-display text-lg font-semibold text-sage-800">
                  {p.name}
                  <span className="block text-sm font-normal text-sage-600">
                    {p.length} · {p.sessions} · {p.price} sample
                  </span>
                </h4>
                <ul className="mt-3 space-y-2 text-[0.95rem]">
                  {p.includes.map((i) => (
                    <li key={i.label} className="flex items-center gap-2">
                      {i.included ? (
                        <Check className="h-4.5 w-4.5 flex-none text-leaf-deep" aria-hidden="true" />
                      ) : (
                        <Minus className="h-4 w-4 flex-none text-sage-600" aria-hidden="true" />
                      )}
                      <span className={i.included ? "text-sage-800" : "text-sage-600"}>{i.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-6 flex max-w-3xl gap-2.5 rounded-xl bg-cream px-4 py-3 text-[0.95rem] text-sage-700">
            <Info className="mt-0.5 h-4.5 w-4.5 flex-none text-sage-700" aria-hidden="true" />
            {HSA_NOTE}
          </p>
        </div>
      </div>

      {/* Plan detail dialog */}
      <AccessibleDialog
        open={detail !== null}
        onClose={() => setDetail(null)}
        label={detail ? `${detail.name} plan details` : "Plan details"}
        labelledBy="plan-detail-title"
        panelClassName="sm:max-w-2xl"
      >
        {detail && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-sage-200 px-5 pb-4 pt-5 sm:px-8">
              <p className="eyebrow">
                {detail.length} · {detail.sessions} · {detail.price} sample price
              </p>
              <h2 id="plan-detail-title" className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                {detail.name}
              </h2>
              <p className="mt-2 text-sage-600">{detail.audience}</p>
            </div>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-8">
              <section aria-label="Session by session outline">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                  Session by session
                </h3>
                <ol className="mt-3 space-y-4">
                  {detail.outline.map((o) => (
                    <li key={o.title} className="rounded-xl border border-sage-200 bg-white/70 p-4">
                      <p className="text-sm font-bold uppercase tracking-wide text-ember">{o.when}</p>
                      <p className="mt-0.5 font-display text-lg font-semibold text-sage-800">{o.title}</p>
                      <p className="mt-1 text-[0.95rem] text-sage-600">{o.text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-label="What you will leave with">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                  What you&apos;ll leave with
                </h3>
                <ul className="mt-3 space-y-2">
                  {detail.leaveWith.map((l) => (
                    <li key={l} className="flex gap-2.5 text-[0.98rem] text-sage-700">
                      <Check className="mt-1 h-4.5 w-4.5 flex-none text-leaf-deep" aria-hidden="true" />
                      {l}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-label="What it asks of you">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                  What it asks of you
                </h3>
                <ul className="mt-3 space-y-2">
                  {detail.asksOfYou.map((a) => (
                    <li key={a} className="flex gap-2.5 text-[0.98rem] text-sage-700">
                      <ArrowRight className="mt-1 h-4.5 w-4.5 flex-none text-terracotta" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="border-t border-sage-200 bg-cream px-5 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => {
                  const id = detail.id;
                  setDetail(null);
                  // open booking after this dialog closes so focus moves cleanly
                  window.setTimeout(() => openBooking({ plan: id }), 60);
                }}
                className="btn btn-primary w-full sm:w-auto"
              >
                Talk about {detail.name} on a free call
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-2 text-sm text-sage-600">
                Free, 15–20 minutes, by video. No payment happens on a fit call.
              </p>
            </div>
          </div>
        )}
      </AccessibleDialog>
    </section>
  );
}
