"use client";

import Image from "next/image";
import { ListChecks, Package, ShoppingBasket, Dumbbell } from "lucide-react";
import { TOOLKIT } from "@/lib/data";
import { LeafSprig } from "./decor";
import { withFallback } from "@/lib/image-fallback";

const TOOLKIT_ICONS = [Package, ListChecks, ShoppingBasket, Dumbbell] as const;

export function Toolkit() {
  return (
    <section aria-labelledby="toolkit-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">
              <LeafSprig className="h-5 w-7 text-olive" />
              Your kitchen toolkit
            </p>
            <h2 id="toolkit-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Things you&apos;ll hold, not promises you&apos;ll hear
            </h2>
            <p className="mt-4 text-sage-600">
              Every program builds real deliverables you keep forever — printed, pinned to the
              fridge, or living in your phone. Here is the concrete stuff.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-sage-200 shadow-[0_16px_40px_-20px_rgb(34_55_40/0.35)]">
              <Image
                src="/images/cooking.jpg"
                alt="Hands dicing onions and tomatoes on a wooden cutting board in a home kitchen"
                width={1200}
                height={804}
                loading="lazy"
                onError={withFallback}
                className="aspect-[3/2] w-full object-cover"
                sizes="(min-width: 1024px) 32rem, 100vw"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ol className="grid gap-4 sm:grid-cols-2">
              {TOOLKIT.map((t, i) => {
                const Icon = TOOLKIT_ICONS[i];
                return (
                  <li key={t.id} className="card flex h-full flex-col p-5 transition-transform duration-200 hover:-translate-y-1">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-wheat text-sage-800">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-sage-800">
                      {t.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.98rem] text-sage-600">{t.text}</p>
                    <p className="mt-3 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-olive-deep">
                      Yours to keep
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-5 text-[0.95rem] text-sage-600">
              Deliverables, not outcomes: your body sets the results; we make sure you&apos;re
              never starting from a blank fridge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
