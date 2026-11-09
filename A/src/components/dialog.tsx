"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./brand";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  closeLabel?: string;
  size?: "md" | "lg";
  panelClassName?: string;
  bodyClassName?: string;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: portal, labelled dialog, Escape to close, backdrop close,
 * focus trap, focus restoration, and background scroll lock.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
  closeLabel = "Close dialog",
  size = "md",
  panelClassName = "",
  bodyClassName = "",
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = labelledBy;

  useEffect(() => {
    if (!open) return;

    restoreRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const shell = document.getElementById("page-shell");
    shell?.setAttribute("inert", "");

    const panel = panelRef.current;
    const firstTarget =
      panel?.querySelector<HTMLElement>("[data-autofocus]") ??
      panel?.querySelector<HTMLElement>(FOCUSABLE);
    window.requestAnimationFrame(() => {
      firstTarget?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((node) => node.offsetParent !== null || node === document.activeElement);

      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      shell?.removeAttribute("inert");
      const restoreTo = restoreRef.current;
      if (restoreTo && document.contains(restoreTo)) {
        restoreTo.focus();
      }
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const content = open ? (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#1c2a21]/55"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={describedBy}
        className={`dialogue-panel relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-b-none sm:rounded-2xl ${
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-xl"
        } ${panelClassName}`}
      >
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-cream text-sage transition-colors hover:bg-wheat"
          aria-label={closeLabel}
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <div className={`flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  ) : null;

  return createPortal(content, document.body);
}
