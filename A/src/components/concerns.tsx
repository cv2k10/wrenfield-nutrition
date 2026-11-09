"use client";

import { useId, useState } from "react";
import { concerns } from "@/content/site";
import { useFunnel } from "./funnel-context";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  InfoIcon,
  LeafSprig,
  PlateDivider,
  SectionHeading,
} from "./brand";

export function Concerns() {
  const { openBooking } = useFunnel();
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="sound-familiar"
      aria-labelledby="sound-familiar-title"
      className="scroll-mt-24 border-y border-wheat-deep/60 bg-wheat/55 py-16 md:py-24"
    >
      <div className="container-editorial">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="sound-familiar-title"
            eyebrow="Sound familiar?"
            title="Four things we hear in almost every first call."
            intro={
              <p>
                Tap the one that sounds like your week. You will get a plain explanation, one
                small thing to try, and a reminder about what belongs with your prescriber.
              </p>
            }
          />
          <div className="hidden shrink-0 flex-col items-end gap-2 md:flex" aria-hidden="true">
            <LeafSprig className="h-12 w-24 text-olive" flip />
            <PlateDivider className="h-7 w-32" />
          </div>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {concerns.map((concern, index) => {
            const isOpen = openId === concern.id;
            const buttonId = `${baseId}-${concern.id}-button`;
            const panelId = `${baseId}-${concern.id}-panel`;
            return (
              <li key={concern.id} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-2xl border bg-cream transition-shadow ${
                    isOpen
                      ? "border-olive shadow-lift"
                      : "border-line shadow-card hover:border-olive/70"
                  }`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : concern.id)}
                    className="flex w-full items-start gap-3.5 rounded-2xl px-5 py-5 text-left sm:px-6"
                  >
                    <span className="mt-0.5 font-serif text-lg text-terracotta" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">
                      <span className="block font-serif text-[1.22rem] leading-snug text-sage sm:text-[1.3rem]">
                        {concern.title}
                      </span>
                      <span className="mt-1 block text-[0.95rem] leading-snug text-cocoa">
                        {concern.summary}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-clay-text">
                        {isOpen ? "Close this" : "Open this"}
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </span>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="border-t border-line px-5 pb-5 pt-4 sm:px-6"
                  >
                    <h3 className="font-serif text-[1.05rem] text-sage">Why it often happens</h3>
                    <div className="mt-1.5 space-y-2 text-[1.0625rem] leading-relaxed text-cocoa">
                      {concern.why.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <h3 className="mt-4 font-serif text-[1.05rem] text-sage">
                      One small thing to try this week
                    </h3>
                    <ul className="mt-1.5 space-y-2">
                      {concern.tryThis.map((idea) => (
                        <li key={idea} className="flex items-start gap-2.5 text-[1.0625rem] text-cocoa">
                          <LeafSprig className="mt-1 h-4 w-6 shrink-0 text-olive" />
                          <span>{idea}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-clay-text/30 bg-clay-wash p-3">
                      <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-clay-text" />
                      <p className="text-sm leading-relaxed text-clay-text">
                        {concern.prescriber}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary mt-4 w-full sm:w-auto"
                      onClick={() =>
                        openBooking({
                          concern: concern.id,
                        })
                      }
                    >
                      Work on this with a coach
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-cocoa">
          Nothing here is medical advice, and none of it replaces your prescriber&apos;s plan.
        </p>
      </div>
    </section>
  );
}
