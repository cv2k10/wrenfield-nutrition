"use client";

import { hero } from "@/content/site";
import { useFunnel } from "./funnel-context";
import { SafeImage } from "./safe-image";
import {
  ArrowRightIcon,
  CheckIcon,
  LeafSprig,
  PlateDivider,
  WrenMark,
} from "./brand";

export function Hero() {
  const { openBooking } = useFunnel();

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-8 hidden h-[34rem] w-[34rem] rounded-full border border-wheat-deep/70 lg:block"
      />
      <div className="container-editorial grid gap-10 pb-14 pt-8 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
        <div className="relative">
          <p className="eyebrow flex items-center gap-2">
            <WrenMark className="h-5 w-5 text-sage" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-3.5 max-w-[18ch] font-serif text-[clamp(2.3rem,6.4vw,4rem)] leading-[1.03] tracking-[-0.02em] text-sage"
          >
            Your appetite changed.{" "}
            <span className="italic text-clay-text">Your nutrition plan</span> should too.
          </h1>
          <p className="mt-5 max-w-[38rem] text-[1.0625rem] leading-[1.7] text-cocoa sm:text-[1.125rem]">
            {hero.supporting}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="btn btn-primary min-h-12 px-6 text-[1.02rem]"
              onClick={() => openBooking()}
            >
              Book a free fit call
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <a href="#plate-check" className="btn btn-secondary min-h-12 px-5 text-[1.02rem]">
              {hero.secondaryCta}
            </a>
          </div>
          <p className="mt-2.5 text-sm text-cocoa">
            Free and unhurried. Video or phone, across U.S. time zones. No card, no supplement pitch.
          </p>

          <ul className="mt-7 grid gap-2.5 text-[0.95rem] font-medium text-sage sm:grid-cols-3 sm:gap-4">
            {hero.trustCues.map((cue) => (
              <li key={cue} className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-wash text-leaf-deep">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className="leading-snug">{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[32rem] lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -left-3 top-6 hidden h-[92%] w-full rounded-t-[8rem] border border-olive/35 sm:block"
          />
          <div className="relative overflow-hidden rounded-t-[7rem] rounded-b-2xl border border-line bg-wheat shadow-lift">
            <SafeImage
              src="https://images.pexels.com/photos/14515103/pexels-photo-14515103.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1240&w=1040"
              alt="A home-cooked plate of grilled salmon with roasted carrots, greens and tomatoes, photographed from above on a ceramic dish."
              width={1040}
              height={1240}
              eager
              sizes="(min-width: 1024px) 42vw, 92vw"
              fallbackLabel="Illustration of a balanced, protein-forward plate"
            />
            <figure className="absolute inset-x-3 bottom-3 rounded-xl border border-wheat-deep/70 bg-cream px-4 py-3 shadow-card sm:inset-x-4 sm:bottom-4 sm:max-w-[19rem]">
              <div className="flex items-start gap-2.5">
                <WrenMark className="mt-0.5 h-5 w-5 shrink-0 text-sage" />
                <div>
                  <blockquote className="font-serif text-[1.06rem] leading-snug text-sage">
                    &ldquo;{hero.imageNote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-1 text-xs leading-snug text-cocoa">
                    The whole idea behind a Wrenfield plate plan.
                  </figcaption>
                </div>
              </div>
            </figure>
          </div>
          <p className="mt-3 flex items-start gap-2 text-xs leading-snug text-cocoa">
            <PlateDivider className="mt-0.5 h-5 w-16 shrink-0" />
            {hero.imageCaption}
          </p>
          <LeafSprig className="absolute -right-2 -top-6 hidden h-14 w-24 text-olive lg:block" />
        </div>
      </div>
    </section>
  );
}
