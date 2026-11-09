"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { PlanId, ConcernId } from "@/lib/data";
import type { PlateResult } from "@/lib/scoring";

export type BookingPrefill = {
  concern?: ConcernId | "general";
  plan?: PlanId;
};

type FunnelContextValue = {
  bookingOpen: boolean;
  openBooking: (prefill?: BookingPrefill) => void;
  closeBooking: () => void;
  prefill: BookingPrefill;
  plateResult: PlateResult | null;
  setPlateResult: (r: PlateResult) => void;
};

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [prefill, setPrefill] = useState<BookingPrefill>({});
  const [plateResult, setPlateResultState] = useState<PlateResult | null>(null);

  const openBooking = useCallback((p?: BookingPrefill) => {
    setPrefill(p ?? {});
    setBookingOpen(true);
  }, []);

  const closeBooking = useCallback(() => setBookingOpen(false), []);

  const setPlateResult = useCallback((r: PlateResult) => setPlateResultState(r), []);

  const value = useMemo(
    () => ({ bookingOpen, openBooking, closeBooking, prefill, plateResult, setPlateResult }),
    [bookingOpen, openBooking, closeBooking, prefill, plateResult, setPlateResult]
  );

  return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
}

export function useFunnel(): FunnelContextValue {
  const ctx = useContext(FunnelContext);
  if (!ctx) throw new Error("useFunnel must be used inside <FunnelProvider>");
  return ctx;
}
