"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/data";
import { PlateDivider } from "./decor";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <p className="eyebrow justify-center">Plain answers</p>
          <h2 id="faq-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const btnId = `faq-btn-${i}`;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={f.q} className="card overflow-hidden">
                <h3 className="font-body">
                  <button
                    id={btnId}
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-[44px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-body text-lg font-bold text-sage-800 transition-colors hover:bg-cream-deep"
                  >
                    {f.q}
                    <ChevronDown
                      className={`h-5 w-5 flex-none text-terracotta transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="border-t border-sage-200 px-5 py-4">
                  <p className="text-sage-700">{f.a}</p>
                </div>
              </div>
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
