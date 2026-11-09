"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DialogProps = {
  open: boolean;
  onClose: () => void;
  label: string; // accessible name (visible heading should reference id)
  labelledBy?: string;
  children: ReactNode;
  panelClassName?: string;
  /** element to focus on open; defaults to first focusable */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** access to the panel element (e.g. to query invalid fields) */
  panelRef?: RefObject<HTMLDivElement | null>;
};

/**
 * Accessible modal dialog: aria-modal, labelled name, Escape to close,
 * Tab focus trap, focus restoration, body scroll lock.
 */
export function AccessibleDialog({
  open,
  onClose,
  label,
  labelledBy,
  children,
  panelClassName = "",
  initialFocusRef,
  panelRef: externalPanelRef,
}: DialogProps) {
  const internalPanelRef = useRef<HTMLDivElement>(null);
  const panelRef = externalPanelRef ?? internalPanelRef;
  const restoreRef = useRef<HTMLElement | null>(null);
  const fallbackId = useId();
  const nameId = labelledBy ?? fallbackId;

  // open/close lifecycle: save focus, lock scroll, restore on close
  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target =
        initialFocusRef?.current ??
        (panel.querySelector(FOCUSABLE) as HTMLElement | null) ??
        panel;
      target.focus();
    }, 30);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open, initialFocusRef]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
      onKeyDown={onKeyDown}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-sage-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        {...(labelledBy ? { "aria-labelledby": nameId } : { "aria-label": label })}
        tabIndex={-1}
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-sage-200 bg-cream shadow-2xl sm:max-w-xl sm:rounded-3xl ${panelClassName}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-sage-200 bg-cream text-sage-800 transition-colors hover:bg-wheat"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
