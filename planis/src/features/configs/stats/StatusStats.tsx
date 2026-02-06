import React from "react";
import type { StatusStatsData } from "../../../types/StatsTypes";
import type { StatsComponentProps } from "../StatsConfig";
import { STATUS_OPTIONS } from "../../../types/MoodConstants";

export const StatusStats: React.FC<StatsComponentProps<StatusStatsData>> = ({
  data,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-neo-yellow border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="text-sm font-bold text-gray-600 mb-1">État moyen</div>
        <div className="text-3xl font-black flex items-center gap-3">
          {data.average.toFixed(1)}
          <span className="text-4xl">
            {STATUS_OPTIONS.find((s) => s.value === Math.round(data.average))
              ?.emoji || "😐"}
          </span>
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Distribution</div>
        <div className="space-y-3">
          {STATUS_OPTIONS.map((status) => {
            const count = data.distribution[status.value] || 0;
            const percentage =
              data.totalEvents > 0 ? (count / data.totalEvents) * 100 : 0;
            return (
              <div key={status.value}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{status.emoji}</span>
                    <span className="font-bold text-sm">{status.label}</span>
                  </div>
                  <span className="font-black text-sm">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-4 bg-gray-200 rounded border-2 border-black">
                  <div
                    className="h-full bg-neo-yellow rounded-l"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Évolution</div>
        <div className="h-32 flex items-end justify-around gap-1">
          {data.values.slice(-15).map((item, index) => {
            const height = (item.value / 5) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-neo-yellow border-2 border-black rounded-t flex items-start justify-center pt-1"
                  style={{ height: `${height}%`, minHeight: "24px" }}
                  title={`${STATUS_OPTIONS.find((s) => s.value === item.value)?.label} - ${item.date.toLocaleDateString()}`}
                >
                  <span className="text-xs">
                    {STATUS_OPTIONS.find((s) => s.value === item.value)?.emoji}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-sm text-gray-600 font-bold">
        {data.totalEvents} événement{data.totalEvents > 1 ? "s" : ""}
      </div>
    </div>
  );
};
