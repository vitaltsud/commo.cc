import type { ProPlanCode } from "@/db/schema";

/** Максимум городов в списке мастера по плану. Минимум 3 (free), на платных больше. */
export const MAX_CITIES_BY_PLAN: Record<ProPlanCode, number> = {
  free: 3,
  basic: 5,
  premium: 10,
};

export function getMaxCitiesForPlan(plan: ProPlanCode): number {
  return MAX_CITIES_BY_PLAN[plan] ?? MAX_CITIES_BY_PLAN.free;
}
