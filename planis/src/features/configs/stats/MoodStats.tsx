import React from "react";
import type { MoodStatsData } from "../../../types/StatsTypes";
import type { StatsComponentProps } from "../StatsConfig";
import { MOOD_OPTIONS } from "../../../types/MoodConstants";

export const MoodStats: React.FC<StatsComponentProps<MoodStatsData>> = ({
  data,
}) => {
  const mostFrequentMood = MOOD_OPTIONS.find(
    (m) => m.value === data.mostFrequent,
  );

  return (
    <div className="space-y-6">
      <div className="bg-neo-purple border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="text-sm font-bold mb-1">Humeur la plus fréquente</div>
        <div className="text-2xl font-black flex items-center gap-3">
          <span className="text-4xl">{mostFrequentMood?.emoji || "😐"}</span>
          <span>{mostFrequentMood?.label || "N/A"}</span>
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm max-h-96 overflow-y-auto">
        <div className="font-bold mb-4">Distribution des humeurs</div>
        <div className="space-y-2">
          {Object.entries(data.distribution)
            .sort(([, a], [, b]) => b - a)
            .map(([moodValue, count]) => {
              const mood = MOOD_OPTIONS.find((m) => m.value === moodValue);
              const percentage =
                data.totalEvents > 0 ? (count / data.totalEvents) * 100 : 0;
              return (
                <div key={moodValue}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{mood?.emoji}</span>
                      <span className="font-bold text-sm">{mood?.label}</span>
                    </div>
                    <span className="font-black text-sm">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded border-2 border-black">
                    <div
                      className="h-full rounded-l"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: mood?.color || "#8B5CF6",
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="bg-white border-2 border-black p-4 rounded-lg shadow-neo-sm">
        <div className="font-bold mb-4">Évolution récente</div>
        <div className="flex flex-wrap gap-2">
          {data.values.slice(-20).map((item, index) => {
            const mood = MOOD_OPTIONS.find((m) => m.value === item.value);
            return (
              <div
                key={index}
                className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center text-2xl shadow-neo-sm"
                style={{ backgroundColor: mood?.color || "#8B5CF6" }}
                title={`${mood?.label} - ${item.date.toLocaleDateString()}`}
              >
                {mood?.emoji}
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
