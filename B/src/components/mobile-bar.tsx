"use client";

import { CalendarCheck2, ClipboardList } from "lucide-react";
import { useFunnel } from "./funnel-context";

/** Sticky mobile action bar — md+ hides it; page padding keeps it from covering content. */
export function MobileBar() {
  const { openBooking } = useFunnel();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-200 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-sm md:hidden"
      role="group"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-md gap-3">
        <button
          type="button"
          onClick={() => openBooking()}
          className="btn btn-primary flex-1"
        >
          <CalendarCheck2 className="h-4.5 w-4.5" aria-hidden="true" />
          Free call
        </button>
        <a href="#plate-check" className="btn btn-secondary flex-1">
          <ClipboardList className="h-4.5 w-4.5" aria-hidden="true" />
          Plate Check
        </a>
      </div>
    </div>
  );
}
