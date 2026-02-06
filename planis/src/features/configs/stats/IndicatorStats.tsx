import React from "react";
import type { IndicatorStatsData } from "../../../types/StatsTypes";
import type { StatsComponentProps } from "../StatsConfig";

export const IndicatorStats: React.FC<
  StatsComponentProps<IndicatorStatsData>
> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neo-green border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Vrai</div>
          <div className="text-3xl font-black">{data.trueCount}</div>
          <div className="text-sm text-gray-600 font-bold">
            {data.truePercentage.toFixed(0)}%
          </div>
        </div>
        <div className="bg-neo-orange border-2 border-black p-4 rounded-lg shadow-neo-sm">
          <div className="text-sm font-bold text-gray-600 mb-1">Faux</div>
          <div className="text-3xl font-black">{data.falseCount}</div>
          <div className="text-sm text-gray-600 font-bold">
            {data.falsePercentage.toFixed(0)}%
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Répartition</div>
        <div className="h-8 flex rounded-lg overflow-hidden border-2 border-black">
          <div
            className="bg-neo-green flex items-center justify-center font-black text-sm"
            style={{ width: `${data.truePercentage}%` }}
          >
            {data.truePercentage > 15 && `${data.truePercentage.toFixed(0)}%`}
          </div>
          <div
            className="bg-neo-orange flex items-center justify-center font-black text-sm"
            style={{ width: `${data.falsePercentage}%` }}
          >
            {data.falsePercentage > 15 && `${data.falsePercentage.toFixed(0)}%`}
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Évolution récente</div>
        <div className="flex items-center gap-1">
          {data.values.slice(-20).map((item, index) => (
            <div
              key={index}
              className={`w-3 h-12 rounded border-2 border-black ${
                item.value ? "bg-neo-green" : "bg-neo-orange"
              }`}
              title={`${item.value ? "Vrai" : "Faux"} - ${item.date.toLocaleDateString()}`}
            />
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-600 font-bold">
        {data.totalEvents} événement{data.totalEvents > 1 ? "s" : ""}
      </div>
    </div>
  );
};
