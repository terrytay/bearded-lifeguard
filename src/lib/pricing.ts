export type BookingInput = {
  dateISO: string; // e.g. "2025-09-01"
  hours: number; // whole hours
  location?: string;
};

export type QuoteResult = {
  baseRate: number;
  baseSubtotal: number;
  surchargePct: number; // 0..1
  surchargeAmount: number;
  total: number;
  lastMinuteTier: "none" | "<1w" | "<2d" | "<1d";
};

export function computeBaseRate(hours: number): number {
  if (hours < 4) return 50;
  if (hours === 4) return 30;
  if (hours === 5) return 25;
  return 21; // >6 hour
}

import { SingaporeTime } from "./singapore-time";

export function computeLastMinuteSurcharge(
  dateISO: string
): QuoteResult["lastMinuteTier"] {
  const now = SingaporeTime.now();
  const target = new Date(dateISO); // dateISO is already Singapore time
  const ms = target.getTime() - now.getTime();
  const days = ms / (1000 * 60 * 60 * 24);

  if (days < 1) return "<1d";
  if (days < 2) return "<2d";
  if (days < 7) return "<1w";
  return "none";
}

export function quote(input: BookingInput): QuoteResult {
  const baseRate = computeBaseRate(input.hours);
  const baseSubtotal = baseRate * input.hours;

  const tier = computeLastMinuteSurcharge(input.dateISO);
  const pct =
    tier === "<1d" ? 1 : tier === "<2d" ? 0.4 : tier === "<1w" ? 0.2 : 0;

  const surchargeAmount = Math.round(baseSubtotal * pct * 100) / 100;
  const total = Math.round((baseSubtotal + surchargeAmount) * 100) / 100;

  return {
    baseRate,
    baseSubtotal,
    surchargePct: pct,
    surchargeAmount,
    total,
    lastMinuteTier: tier,
  };
}
