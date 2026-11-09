"use client";

import { useId, useState } from "react";
import { brand, faqs } from "@/content/site";
import { useFunnel } from "./funnel-context";
import { ChevronDownIcon, LeafSprig, SectionHeading } from "./brand";

export function Faq() {
  const { openBooking } = useFunnel();
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-cream py-16 md:py-24">
      <div className="container-editorial">
        <div className="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-title"
              eyebrow="Questions, answered plainly"
              title="The things people ask before booking."
              intro={
                <p>
                  If something is not here, ask it on the free call. We would rather answer an
                  awkward question than have you guess.
                </p>
              }
            />
            <div className="mt-6 rounded-2xl border border-line bg-white/70 p-5">
              <h3 className="font-serif text-[1.2rem] text-sage">Still unsure?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cocoa">
                A 20-minute fit call is free, and there is no card and no pitch. If coaching is not
                the right support for you, we will say so.
              </p>
              <button type="button" className="btn btn-primary mt-3.5 w-full" onClick={() => openBooking()}>
                Book a free fit call
              </button>
              <p className="mt-3 text-xs leading-relaxed text-cocoa">
                Sample contact:{" "}
                <a href={`mailto:${brand.contact.email}`} className="link-inline break-all">
                  {brand.contact.email}
                </a>{" "}
                · {brand.contact.phone}
              </p>
            </div>
            <LeafSprig className="mt-6 hidden h-12 w-24 text-olive lg:block" />
          </div>

          <div className="divide-y divide-line rounded-2xl border border-line bg-white/70">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const buttonId = `${baseId}-faq-${index}`;
              const panelId = `${baseId}-faq-panel-${index}`;
              return (
                <div key={faq.q}>
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left hover:bg-cream-deep/60 sm:px-5"
                    >
                      <span className="font-serif text-[1.1rem] leading-snug text-sage sm:text-[1.17rem]">
                        {faq.q}
                      </span>
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong text-sage transition-transform ${
                          isOpen ? "rotate-180 bg-wheat" : "bg-cream"
                        }`}
                        aria-hidden="true"
                      >
                        <ChevronDownIcon className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="px-4 pb-4 sm:px-5"
                  >
                    {faq.a.map((paragraph) => (
                      <p key={paragraph.slice(0, 30)} className="mt-2 text-[1.0625rem] leading-relaxed text-cocoa">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
