"use client";

import { useState } from "react";
import { CalendarCheck2, ClipboardList, Lock, Mail, Phone } from "lucide-react";
import { NAV_LINKS, PLANS, SITE } from "@/lib/data";
import { PlateDivider, WrenMark } from "./decor";
import { useFunnel } from "./funnel-context";
import { AccessibleDialog } from "./dialog";

export function FinalCta() {
  const { openBooking } = useFunnel();
  return (
    <section aria-labelledby="final-heading" className="bg-sage-800 text-cream">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <div className="mx-auto flex justify-center text-olive" aria-hidden="true">
          <PlateDivider className="h-6 w-72 text-sage-600" />
        </div>
        <h2
          id="final-heading"
          className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-cream sm:text-6xl"
        >
          Eat less. <span className="italic text-[#E8A37E]">Nourish more.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-sage-200">
          If your medication changed your appetite, your food strategy deserves a rebuild — protein
          first, strength protected, habits that survive the prescription. Start with a free,
          pressure-free call.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => openBooking()} className="btn btn-primary text-base">
            <CalendarCheck2 className="h-4.5 w-4.5" aria-hidden="true" />
            Book a free fit call
          </button>
          <a
            href="#plate-check"
            className="btn border-2 border-cream/70 text-cream hover:bg-sage-700"
          >
            <ClipboardList className="h-4.5 w-4.5" aria-hidden="true" />
            Take the Plate Check
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <footer className="border-t border-sage-200 bg-cream" aria-label="Site footer">
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-14 sm:px-6 md:pb-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="flex items-center gap-2.5 text-sage-800">
              <WrenMark className="h-8 w-8" />
              <span className="font-display text-xl font-semibold">
                Wrenfield <span className="italic text-ember">Nutrition</span>
              </span>
            </p>
            <p className="mt-3 max-w-xs text-[0.95rem] text-sage-600">{SITE.tagline}.</p>
            <p className="mt-3 rounded-lg bg-wheat px-3 py-2 text-[0.85rem] font-medium text-sage-700">
              {SITE.demoNotice}
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">Explore</h2>
            <ul className="mt-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex min-h-[40px] items-center font-medium text-sage-700 underline-offset-4 transition-colors hover:text-ember hover:underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Plans">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">Plans</h2>
            <ul className="mt-3 space-y-1">
              {PLANS.map((p) => (
                <li key={p.id}>
                  <a
                    href="#plans"
                    className="inline-flex min-h-[40px] items-center font-medium text-sage-700 underline-offset-4 transition-colors hover:text-ember hover:underline"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-olive-deep">Say hello</h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] text-sage-700">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-none text-olive-deep" aria-hidden="true" />
                <span>
                  <span className="sr-only">Phone (fictional): </span>
                  {SITE.phone} <span className="text-sage-600">(fictional)</span>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-none text-olive-deep" aria-hidden="true" />
                <span>
                  <span className="sr-only">Email (fictional): </span>
                  {SITE.email}
                </span>
              </li>
              <li className="text-sage-600">{SITE.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-sage-200 pt-6">
          <p className="max-w-3xl text-[0.95rem] text-sage-600">
            <strong className="text-sage-800">Not medical advice.</strong> Wrenfield Nutrition is a
            fictional coaching practice shown for this concept website. Nutrition coaching supports
            — and never replaces — care from your prescriber, physician, or registered dietitian.
            Always talk with your prescriber about symptoms, dosing, or stopping medication.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-sage-600">
              © 2026 {SITE.name} — fictional demo. All imagery: stock photography.
            </p>
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-sage-300 px-4 text-sm font-semibold text-sage-700 transition-colors hover:bg-sage-100"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              Privacy notice
            </button>
          </div>
        </div>
      </div>

      <AccessibleDialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        label="Privacy notice"
        labelledBy="privacy-title"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8">
          <p className="eyebrow">Demo privacy notice</p>
          <h2 id="privacy-title" className="mt-1 font-display text-2xl font-semibold">
            Privacy, in plain English
          </h2>
          <div className="mt-4 space-y-3 text-[0.98rem] text-sage-700">
            <p>
              This is a concept website for a fictional business. Even so, it behaves the way a
              real site should:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Nothing you type leaves your browser.</strong> Every form on this page —
                the fit call request, the Plate Check, the guide signup — runs entirely on your
                device. There is no backend, no database write, and no network request.
              </li>
              <li>
                <strong>Nothing is stored.</strong> No cookies, no local storage, no analytics, no
                trackers. Refresh the page and everything is gone.
              </li>
              <li>
                <strong>Nothing is shared.</strong> Because nothing is collected, there is nothing
                to sell, share, or leak.
              </li>
              <li>
                Any contact details shown (like {SITE.phone} or {SITE.email}) are fictional
                placeholders for this demo.
              </li>
            </ul>
            <p>
              If this were a real practice, this is also where you would read how health-adjacent
              details are kept strictly between you and your coach, and never shared without your
              written consent.
            </p>
          </div>
          <button type="button" onClick={() => setPrivacyOpen(false)} className="btn btn-primary mt-6">
            Got it
          </button>
        </div>
      </AccessibleDialog>
    </footer>
  );
}
