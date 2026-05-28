import { SingaporeTime } from "./singapore-time";

export type RateCategory = "swimming-pool" | "open-water";

export type ServiceType =
  | "pools"
  | "pool-parties"
  | "open-water"
  | "events"
  | "others"
  | "";

export const RATE_TABLE: Record<RateCategory, Record<1 | 2 | 3 | 4 | 5 | 6, number>> = {
  "swimming-pool": { 1: 50, 2: 45, 3: 40, 4: 35, 5: 30, 6: 25 },
  "open-water":    { 1: 60, 2: 55, 3: 50, 4: 45, 5: 40, 6: 35 },
};

export function computeBaseRate(hours: number, category: RateCategory): number {
  const tier = Math.min(6, Math.max(1, Math.ceil(hours))) as 1 | 2 | 3 | 4 | 5 | 6;
  return RATE_TABLE[category][tier];
}

export function computeBaseSubtotal(hours: number, category: RateCategory): number {
  return computeBaseRate(hours, category) * hours;
}

export function lastMinuteMultiplier(noticeDays: number): number {
  if (noticeDays < 1) return 1.5;
  if (noticeDays < 2) return 1.4;
  if (noticeDays < 3) return 1.3;
  if (noticeDays < 7) return 1.2;
  if (noticeDays < 14) return 1.1;
  return 1.0;
}

export function lastMinuteLabel(noticeDays: number | null): string {
  if (noticeDays == null) return "-";
  if (noticeDays < 1) return "Less than 1 day (+50%)";
  if (noticeDays < 2) return "Less than 2 days (+40%)";
  if (noticeDays < 3) return "Less than 3 days (+30%)";
  if (noticeDays < 7) return "Less than 1 week (+20%)";
  if (noticeDays < 14) return "Less than 2 weeks (+10%)";
  return "Standard rate";
}

export function rateCategoryLabel(category: RateCategory): string {
  return category === "swimming-pool" ? "Swimming pool" : "Open water / beach";
}

const FIXED_CATEGORY: Partial<Record<ServiceType, RateCategory>> = {
  "pools": "swimming-pool",
  "pool-parties": "swimming-pool",
  "open-water": "open-water",
};

export function resolveRateCategory(
  serviceType: string,
  venueType?: RateCategory | null
): RateCategory | null {
  const fixed = FIXED_CATEGORY[serviceType as ServiceType];
  if (fixed) return fixed;
  if (serviceType === "events" || serviceType === "others") {
    return venueType ?? null;
  }
  return null;
}

export function computeNoticeDays(startDateISO: string): number {
  const now = SingaporeTime.now();
  const target = new Date(startDateISO);
  return Math.max(0, (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
