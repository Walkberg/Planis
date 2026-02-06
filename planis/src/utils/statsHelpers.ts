import type { StatsPeriod, StatsDateRange } from "../types/StatsTypes";

export function getDateRangeForPeriod(period: StatsPeriod): StatsDateRange {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case "week":
      start.setDate(end.getDate() - 7);
      break;
    case "month":
      start.setMonth(end.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
}

export function formatPeriodLabel(period: StatsPeriod): string {
  switch (period) {
    case "week":
      return "7 derniers jours";
    case "month":
      return "30 derniers jours";
    case "year":
      return "12 derniers mois";
  }
}
