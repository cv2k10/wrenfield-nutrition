"use client";

import { useFunnel } from "./funnel-context";
import { CalendarIcon, PlateIcon } from "./brand";

/** Sticky mobile actions. Page content reserves space for this bar. */
export function MobileBar() {
  const { openBooking } = useFunnel();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
      role="region"
      aria-label="Quick actions"
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => openBooking()}
          className="btn btn-primary min-h-12 flex-1 px-3 text-sm"
        >
          <CalendarIcon className="h-4 w-4" />
          Free fit call
        </button>
        <a href="#plate-check" className="btn btn-secondary min-h-12 flex-1 px-3 text-sm">
          <PlateIcon className="h-4 w-4" />
          Plate Check
        </a>
      </div>
    </div>
  );
}
