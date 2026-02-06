export type StatsPeriod = "week" | "month" | "year";

export interface StatsDateRange {
  start: Date;
  end: Date;
}

export interface BaseStatsData {
  period: StatsPeriod;
  dateRange: StatsDateRange;
  totalEvents: number;
}

export interface CounterStatsData extends BaseStatsData {
  total: number;
  average: number;
  min: number;
  max: number;
  values: Array<{ date: Date; value: number }>;
}

export interface IndicatorStatsData extends BaseStatsData {
  trueCount: number;
  falseCount: number;
  truePercentage: number;
  falsePercentage: number;
  values: Array<{ date: Date; value: boolean }>;
}

export interface StatusStatsData extends BaseStatsData {
  average: number;
  distribution: Record<number, number>;
  values: Array<{ date: Date; value: number }>;
}

export interface MoodStatsData extends BaseStatsData {
  distribution: Record<string, number>;
  mostFrequent: string;
  values: Array<{ date: Date; value: string }>;
}

export type StatsData =
  | CounterStatsData
  | IndicatorStatsData
  | StatusStatsData
  | MoodStatsData;
