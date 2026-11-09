"use client";

import { useState } from "react";
import { AlarmClockCheck, HeartPulse, Plus, Stethoscope, TrendingDown, Utensils } from "lucide-react";
import { CONCERN_REMINDER, CONCERNS, type ConcernId } from "@/lib/data";
import { useFunnel } from "./funnel-context";
import { PlateDivider } from "./decor";

const CONCERN_ICONS: Record<ConcernId, typeof AlarmClockCheck> = {
  "forget-to-eat": AlarmClockCheck,
  nausea: Utensils,
  weaker: TrendingDown,
  "worried-stop": HeartPulse,
};

export function SoundFamiliar() {
  const { openBooking } = useFunnel();
  const [open, setOpen] = useState<ConcernId | null>(null);

  return (
    <section id="sound-familiar" aria-labelledby="sf-heading" className="scroll-mt-24 bg-wheat">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Sound familiar?</p>
          <h2 id="sf-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            The quiet ways a small appetite trips people up
          </h2>
          <p className="mt-4 text-sage-600">
            Tap the one that sounds like your week. None of these mean you&apos;re doing it wrong —
            they mean your food strategy hasn&apos;t caught up to your new appetite yet.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CONCERNS.map((c) => {
            const isOpen = open === c.id;
            const Icon = CONCERN_ICONS[c.id];
            const panelId = `concern-panel-${c.id}`;
            return (
              <article key={c.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex min-h-[44px] w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-cream-deep"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-wheat text-sage-800">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-xl font-semibold text-sage-800">
                      {c.title}
                    </span>
                    <span className="block text-[0.95rem] text-sage-600">{c.caption}</span>
                  </span>
                  <Plus
                    className={`h-5 w-5 flex-none text-terracotta transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="border-t border-sage-200 px-5 py-5"
                >
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                    Why it often happens
                  </h3>
                  <p className="mt-1.5 text-[1rem] text-sage-700">{c.why}</p>

                  <h3 className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">
                    One small thing to try this week
                  </h3>
                  <p className="mt-1.5 text-[1rem] text-sage-700">{c.tryThis}</p>

                  <p className="mt-4 flex gap-2.5 rounded-xl bg-sage-100 px-4 py-3 text-[0.95rem] text-sage-700">
                    <Stethoscope className="mt-0.5 h-4.5 w-4.5 flex-none text-sage-700" aria-hidden="true" />
                    {CONCERN_REMINDER}
                  </p>

                  <button
                    type="button"
                    onClick={() => openBooking({ concern: c.id })}
                    className="btn btn-tertiary mt-4"
                  >
                    Work on this with a coach
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center text-olive" aria-hidden="true">
          <PlateDivider className="h-6 w-72" />
        </div>
      </div>
    </section>
  );
}
