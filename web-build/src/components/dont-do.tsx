import { ShieldCheck, TriangleAlert, X } from "lucide-react";
import { HONESTY_ROWS } from "@/lib/data";

export function DontDo() {
  return (
    <section aria-labelledby="dont-heading" className="bg-sage-800 text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow" style={{ color: "var(--color-wheat)" }}>
            <ShieldCheck className="h-4 w-4 text-wheat" aria-hidden="true" />
            What we don&apos;t do
          </p>
          <h2 id="dont-heading" className="mt-3 font-display text-3xl font-semibold text-cream sm:text-4xl">
            A short list of things we&apos;ll never sell you
          </h2>
          <p className="mt-4 text-sage-200">
            Nutrition coaching has a hype problem. Here is our side of the line — and the red flags
            worth watching for anywhere else.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-sage-700">
          <div className="grid bg-sage-700/60 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] sm:grid-cols-2">
            <span className="text-wheat">Never here</span>
            <span className="mt-2 text-sage-300 sm:mt-0">Red flag elsewhere</span>
          </div>
          <ul className="divide-y divide-sage-700">
            {HONESTY_ROWS.map((r) => (
              <li key={r.never} className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-terracotta/20">
                    <X className="h-4 w-4 text-[#EFB79F]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold text-cream">{r.never}</p>
                    <p className="text-[0.95rem] text-sage-200">{r.detail}</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:border-l sm:border-sage-700 sm:pl-5">
                  <TriangleAlert className="mt-1 h-4.5 w-4.5 flex-none text-sage-300" aria-hidden="true" />
                  <p className="text-[0.95rem] italic text-sage-300">{r.redFlag}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-2xl text-[0.95rem] text-sage-300">
          The one thing we will always do with medication questions: hand them back to your
          prescriber, where they belong.
        </p>
      </div>
    </section>
  );
}
