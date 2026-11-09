"use client";

import { useState } from "react";
import { brand, navLinks, plans } from "@/content/site";
import { useFunnel } from "./funnel-context";
import { ArrowRightIcon, LockIcon, WrenMark } from "./brand";
import { Dialog } from "./dialog";

export function SiteFooter() {
  const { openBooking } = useFunnel();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const privacyTitleId = "privacy-dialog-title";

  return (
    <footer className="bg-[#24382c] pb-28 pt-14 text-cream md:pb-10">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr] lg:gap-8">
          <div>
            <span className="flex items-center gap-2.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-[#24382c]">
                <WrenMark className="h-7 w-7" />
              </span>
              <span className="font-serif text-[1.3rem] text-cream">Wrenfield Nutrition</span>
            </span>
            <p className="mt-4 max-w-sm text-[1rem] leading-relaxed text-wheat">
              One-to-one nutrition coaching for adults on GLP-1 medications, by video across the
              U.S. Food first, prescriber-led, no supplements.
            </p>
            <button
              type="button"
              className="btn btn-primary mt-5"
              onClick={() => openBooking()}
            >
              Book a free fit call
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <p className="mt-3 text-xs leading-relaxed text-wheat/90">{brand.demoNotice}</p>
          </div>

          <nav aria-label="Footer site links">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-wheat">Explore</h2>
            <ul className="mt-3 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-[0.95rem] text-cream hover:text-wheat hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#toolkit"
                  className="inline-flex min-h-11 items-center text-[0.95rem] text-cream hover:text-wheat hover:underline"
                >
                  Kitchen toolkit
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-wheat">Plans</h2>
            <ul className="mt-3 space-y-1">
              {plans.map((plan) => (
                <li key={plan.id}>
                  <button
                    type="button"
                    onClick={() => openBooking({ planId: plan.id })}
                    className="inline-flex min-h-11 items-center text-left text-[0.95rem] text-cream hover:text-wheat hover:underline"
                  >
                    {plan.name}
                    <span className="ml-1.5 text-xs text-wheat/90">sample ${plan.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-wheat">
              Practice details
            </h2>
            <ul className="mt-3 space-y-2 text-[0.92rem] leading-relaxed text-wheat">
              <li>Video sessions only, across U.S. time zones.</li>
              <li>{brand.contact.hours}</li>
              <li>{brand.contact.responseTime}</li>
              <li>
                <a href={`mailto:${brand.contact.email}`} className="underline hover:text-cream">
                  {brand.contact.email}
                </a>
              </li>
              <li>
                <a href="tel:+15550100142" className="underline hover:text-cream">
                  {brand.contact.phone}
                </a>
              </li>
              <li className="text-xs text-wheat/90">{brand.contact.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-cream/25 bg-[#2b4335] p-4 text-[0.88rem] leading-relaxed text-wheat sm:p-5">
          <p>
            <span className="font-semibold text-cream">Not medical advice.</span>{" "}
            {brand.notMedical} Wrenfield Nutrition is a fictional practice created for this concept
            website: all names, prices, hours and contact details are samples.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-cream/20 pt-5 text-xs text-wheat sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Wrenfield Nutrition · Fictional business · Concept
            website.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => setPrivacyOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 underline hover:text-cream"
            >
              <LockIcon className="h-3.5 w-3.5" />
              Privacy notice
            </button>
            <a href="#top" className="inline-flex min-h-11 items-center underline hover:text-cream">
              Back to top
            </a>
          </div>
        </div>
      </div>

      <Dialog
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        labelledBy={privacyTitleId}
        closeLabel="Close privacy notice"
        size="md"
      >
        <div className="px-5 pb-6 pt-7 sm:px-7">
          <p className="eyebrow pr-14">Sample privacy notice</p>
          <h2 id={privacyTitleId} className="mt-1 pr-14 font-serif text-[1.7rem] leading-tight text-sage">
            Privacy notice for a concept website
          </h2>
          <div className="mt-4 space-y-3 text-[0.97rem] leading-relaxed text-cocoa">
            <p>
              Wrenfield Nutrition is a fictional business built as a design concept. This website
              does not send, submit or store anything you type.
            </p>
            <p>
              <span className="font-semibold text-sage">Forms.</span> The free fit call, the Plate
              Check and the protein plate guide forms run entirely in your browser. There is no
              backend, no database write and no email delivery. Closing the page clears it.
            </p>
            <p>
              <span className="font-semibold text-sage">Cookies and analytics.</span> No tracking
              cookies, advertising pixels or third-party analytics are used.
            </p>
            <p>
              <span className="font-semibold text-sage">Images and fonts.</span> Photography is
              loaded from Pexels and fonts from Google Fonts, so those providers may see your
              browser&apos;s standard request information. Both are public assets.
            </p>
            <p>
              <span className="font-semibold text-sage">A real practice would say more.</span> A
              live version would name its data controller, lawful basis, retention period, and how
              to request access or deletion, and would link a full health-information notice. None
              of that is claimed here.
            </p>
            <p>
              <span className="font-semibold text-sage">Contact (sample).</span>{" "}
              <a href={`mailto:${brand.contact.email}`} className="link-inline break-all">
                {brand.contact.email}
              </a>{" "}
              · {brand.contact.phone}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary mt-5 w-full sm:w-auto"
            onClick={() => setPrivacyOpen(false)}
          >
            Close notice
          </button>
        </div>
      </Dialog>
    </footer>
  );
}
