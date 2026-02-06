import React from "react";
import type { CounterStatsData } from "../../../types/StatsTypes";
import type { StatsComponentProps } from "../StatsConfig";

export const CounterStats: React.FC<StatsComponentProps<CounterStatsData>> = ({
  data,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neo-cyan border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Total</div>
          <div className="text-3xl font-black">{data.total}</div>
        </div>
        <div className="bg-neo-yellow border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Moyenne</div>
          <div className="text-3xl font-black">{data.average.toFixed(1)}</div>
        </div>
        <div className="bg-neo-green border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Minimum</div>
          <div className="text-3xl font-black">{data.min}</div>
        </div>
        <div className="bg-neo-orange border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Maximum</div>
          <div className="text-3xl font-black">{data.max}</div>
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Évolution</div>
        <div className="h-48 flex items-end justify-around gap-1">
          {data.values.slice(-10).map((item, index) => {
            const maxValue = Math.max(...data.values.map((v) => v.value), 1);
            const height = (item.value / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-neo-cyan border-2 border-black rounded-t"
                  style={{ height: `${height}%`, minHeight: "8px" }}
                  title={`${item.value} - ${item.date.toLocaleDateString()}`}
                />
                <div className="text-xs mt-1 font-bold">
                  {item.date.getDate()}
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
