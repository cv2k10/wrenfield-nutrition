import type { PlanId } from "@/content/site";

export type PlateCheckSnapshot = {
  score: number;
  resultTitle: string;
  planId: PlanId;
};

export type BookingPreset = {
  concern?: string;
  planId?: PlanId;
  plateCheck?: PlateCheckSnapshot;
};
