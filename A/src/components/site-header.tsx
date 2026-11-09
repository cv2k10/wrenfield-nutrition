"use client";

import { useEffect, useRef, useState } from "react";
import { brand, navLinks } from "@/content/site";
import { useFunnel } from "./funnel-context";
import { CloseIcon, LeafSprig, MenuIcon, Wordmark } from "./brand";

export function SiteHeader() {
  const { openBooking } = useFunnel();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div className="bg-sage text-cream">
        <div className="container-editorial flex items-center justify-center gap-2 py-1.5">
          <LeafSprig className="hidden h-4 w-8 text-wheat sm:block" />
          <p className="text-center text-[0.72rem] font-medium leading-snug tracking-[0.04em] sm:text-xs">
            {brand.demoNotice}{" "}
            <span className="hidden text-wheat/90 sm:inline">No real bookings, no data collected.</span>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/95 backdrop-blur-sm">
        <div className="container-editorial flex min-h-[4.5rem] items-center justify-between gap-4 py-2.5">
          <a
            href="#top"
            className="flex min-h-11 items-center rounded-md"
            aria-label={`${brand.name} — back to top`}
          >
            <Wordmark />
          </a>

          <nav aria-label="Main navigation" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-2.5 text-[0.93rem] font-medium text-sage transition-colors hover:bg-wheat/70 hover:text-clay-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-primary hidden sm:inline-flex"
              onClick={() => openBooking()}
            >
              Book a free fit call
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line-strong bg-cream text-sage transition-colors hover:bg-wheat xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((current) => !current)}
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="border-t border-line bg-cream xl:hidden"
        >
          <nav aria-label="Mobile navigation" className="container-editorial py-3">
            <ul className="flex flex-col">
              {navLinks.map((link) => (
                <li key={link.href} className="border-b border-line/70 last:border-0">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center py-2 text-[1.0625rem] font-medium text-sage hover:text-clay-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn-primary mt-3 w-full"
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
            >
              Book a free fit call
            </button>
            <p className="mt-2 text-center text-xs text-cocoa">
              Free, 20 minutes · video or phone · no card
            </p>
          </nav>
        </div>
      </header>
    </>
  );
}
