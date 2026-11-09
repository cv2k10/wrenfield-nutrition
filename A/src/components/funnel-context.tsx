"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BookingDialog } from "./booking-dialog";
import type { BookingPreset } from "./funnel-types";

type FunnelContextValue = {
  openBooking: (preset?: BookingPreset) => void;
};

const FunnelContext = createContext<FunnelContextValue | null>(null);

export function useFunnel(): FunnelContextValue {
  const value = useContext(FunnelContext);
  if (!value) {
    throw new Error("useFunnel must be used inside FunnelProvider");
  }
  return value;
}

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<BookingPreset>({});
  const [open, setOpen] = useState(false);

  const openBooking = useCallback((next?: BookingPreset) => {
    setPreset(next ?? {});
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <FunnelContext.Provider value={value}>
      {children}
      <BookingDialog open={open} preset={preset} onClose={close} />
    </FunnelContext.Provider>
  );
}
