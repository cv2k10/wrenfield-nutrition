"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data";
import { WrenMark } from "./decor";
import { useFunnel } from "./funnel-context";

export function Header() {
  const { openBooking } = useFunnel();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      {/* Slim demo notice bar */}
      <div className="bg-wheat px-4 py-1.5 text-center text-[0.8125rem] font-medium text-sage-700">
        {SITE.demoNotice}
      </div>

      <header className="sticky top-0 z-50 border-b border-sage-200/80 bg-cream/92 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a
            href="#top"
            className="flex min-h-[44px] items-center gap-2.5 rounded-lg pr-2 text-sage-800"
            aria-label="Wrenfield Nutrition — back to top"
          >
            <WrenMark className="h-8 w-8 text-sage-800" />
            <span className="font-display text-xl font-semibold leading-none tracking-tight">
              Wrenfield
              <span className="ms-1.5 font-display text-xl font-medium italic text-ember">Nutrition</span>
            </span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[0.95rem] font-semibold text-sage-700 transition-colors hover:bg-sage-100 hover:text-sage-900"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn btn-primary hidden px-5 lg:inline-flex"
            >
              Book a free fit call
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 text-sage-800 transition-colors hover:bg-sage-100 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-cream lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-sage-200 px-4 sm:px-6">
            <span className="flex items-center gap-2.5 text-sage-800" aria-hidden="true">
              <WrenMark className="h-8 w-8" />
              <span className="font-display text-xl font-semibold">Wrenfield Nutrition</span>
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sage-300 text-sage-800 transition-colors hover:bg-sage-100"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-6">
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={closeMenu}
                    className="flex min-h-[52px] items-center justify-between rounded-xl px-3 font-display text-2xl font-medium text-sage-800 transition-colors hover:bg-wheat"
                  >
                    {l.label}
                    <span className="text-terracotta" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-sage-200 p-6">
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openBooking();
              }}
              className="btn btn-primary w-full"
            >
              Book a free fit call
            </button>
          </div>
        </div>
      )}
    </>
  );
}
