import React from "react";
import type { FieldType } from "../../types/FieldConfig";

export interface StatsComponentProps<T> {
  data: T;
}

export interface StatsConfig {
  name: string;
  component: React.ComponentType<StatsComponentProps<any>>;
}

const CounterStats = React.lazy(() =>
  import("./stats/CounterStats").then((m) => ({ default: m.CounterStats })),
);
const IndicatorStats = React.lazy(() =>
  import("./stats/IndicatorStats").then((m) => ({ default: m.IndicatorStats })),
);
const StatusStats = React.lazy(() =>
  import("./stats/StatusStats").then((m) => ({ default: m.StatusStats })),
);
const MoodStats = React.lazy(() =>
  import("./stats/MoodStats").then((m) => ({ default: m.MoodStats })),
);

export const statsConfig: Partial<Record<FieldType, StatsConfig>> = {
  counter: {
    name: "Compteur",
    component: CounterStats,
  },
  indicator: {
    name: "Indicateur",
    component: IndicatorStats,
  },
  status: {
    name: "État",
    component: StatusStats,
  },
  mood: {
    name: "Humeur",
    component: MoodStats,
  },
};
