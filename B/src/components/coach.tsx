"use client";

import Image from "next/image";
import { BadgeCheck, Check } from "lucide-react";
import { COACH, PROMISES } from "@/lib/data";
import { LeafSprig } from "./decor";
import { withFallback } from "@/lib/image-fallback";

export function Coach() {
  return (
    <section id="coach" aria-labelledby="coach-heading" className="scroll-mt-24 bg-cream-deep">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* Portrait */}
          <figure className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm">
              <div className="overflow-hidden rounded-[2rem] border-8 border-wheat shadow-[0_24px_60px_-24px_rgb(34_55_40/0.35)]">
                <Image
                  src="/images/coach.jpg"
                  alt="Illustrative portrait: a coach in an apron standing in a bright home kitchen, smiling by the counter"
                  width={1000}
                  height={1500}
                  loading="lazy"
                  onError={withFallback}
                  className="aspect-[4/5] w-full object-cover"
                  sizes="(min-width: 1024px) 28rem, 90vw"
                />
              </div>
              <figcaption className="absolute -bottom-4 left-1/2 w-[92%] -translate-x-1/2 rounded-full border border-sage-200 bg-cream px-4 py-2 text-center text-[0.85rem] font-semibold text-sage-700 shadow-sm">
                <BadgeCheck className="me-1 inline h-4 w-4 text-olive-deep" aria-hidden="true" />
                {COACH.label}
              </figcaption>
            </div>
          </figure>

          {/* Story + promises */}
          <div className="lg:col-span-7">
            <p className="eyebrow">
              <LeafSprig className="h-5 w-7 text-olive" />
              Meet the coach
            </p>
            <h2 id="coach-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Hi, I&apos;m {COACH.name}
              <span className="mt-1 block text-lg font-normal italic text-sage-600">
                a sample coach profile
              </span>
            </h2>
            {COACH.story.map((p, i) => (
              <p key={i} className="mt-4 text-sage-700">
                {p}
              </p>
            ))}
            <p className="mt-4 text-sm italic text-sage-600">{COACH.note}</p>

            <div className="mt-8 rounded-2xl bg-sage-800 p-6 text-cream sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-cream">Our promises to you</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {PROMISES.map((pr) => (
                  <li key={pr.title} className="flex gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-leaf/25">
                      <Check className="h-4.5 w-4.5 text-[#BFE3CC]" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold text-cream">{pr.title}</p>
                      <p className="text-[0.95rem] text-sage-200">{pr.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
