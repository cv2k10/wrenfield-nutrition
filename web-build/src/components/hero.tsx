"use client";

import Image from "next/image";
import { ClipboardList, Handshake, Tag, Ban } from "lucide-react";
import { LeafSprig, Squiggle, WrenMark } from "./decor";
import { useFunnel } from "./funnel-context";
import { withFallback } from "@/lib/image-fallback";

const TRUST_CUES = [
  { icon: Handshake, label: "Works alongside your prescriber" },
  { icon: Tag, label: "Clear pricing up front" },
  { icon: Ban, label: "No supplements to buy" },
];

export function Hero() {
  const { openBooking } = useFunnel();
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="lg:col-span-6 animate-fade-up">
          <p className="eyebrow">
            <LeafSprig className="h-5 w-7 text-olive" />
            GLP-1 nutrition coaching · by video · across the U.S.
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-sage-800 sm:text-6xl"
          >
            Your appetite changed.{" "}
            <span className="relative inline-block italic text-terracotta">
              Your nutrition plan
              <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-terracotta/70" />
            </span>{" "}
            should too.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-sage-600">
            One-to-one nutrition coaching for adults taking semaglutide, tirzepatide, or other
            GLP-1 medications — or coming off them. Eat enough protein on a small appetite, handle
            side-effect days with food, protect your strength, and build habits that hold if you
            ever stop.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => openBooking()} className="btn btn-primary text-base">
              Book a free fit call
            </button>
            <a href="#plate-check" className="btn btn-secondary">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Take the Plate Check (2 min)
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="What you can count on">
            {TRUST_CUES.map((c) => (
              <li key={c.label} className="flex items-center gap-2 text-[0.95rem] font-semibold text-sage-700">
                <c.icon className="h-4 w-4 text-olive-deep" aria-hidden="true" />
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Photo */}
        <div className="relative lg:col-span-6 animate-fade-up-late">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div
              className="overflow-hidden rounded-b-[2rem] rounded-t-[10rem] border-8 border-wheat shadow-[0_24px_60px_-24px_rgb(34_55_40/0.35)]"
            >
              <Image
                src="/images/hero.jpg"
                alt="Overhead view of a balanced, protein-forward bowl with salmon, eggs, and colorful chopped vegetables"
                width={1600}
                height={1200}
                priority
                onError={withFallback}
                className="aspect-[5/6] w-full object-cover sm:aspect-[4/3.4]"
                sizes="(min-width: 1024px) 46rem, 100vw"
              />
            </div>
            {/* Floating card */}
            <figure className="absolute -bottom-6 left-1/2 w-[86%] max-w-xs -translate-x-1/2 -rotate-1 rounded-2xl border border-sage-200 bg-cream p-4 shadow-[0_16px_40px_-16px_rgb(34_55_40/0.4)] sm:left-6 sm:translate-x-0">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-wheat">
                  <WrenMark className="h-6 w-6 text-sage-800" strokeWidth={3} />
                </span>
                <blockquote className="font-display text-lg font-medium italic leading-snug text-sage-800">
                  &ldquo;Eating less? Then every bite has to count.&rdquo;
                </blockquote>
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
