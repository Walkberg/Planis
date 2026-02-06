import React, { useState, useEffect, Suspense } from "react";
import type { FieldConfig } from "../../../types/FieldConfig";
import type {
  StatsPeriod,
  CounterStatsData,
  IndicatorStatsData,
  StatusStatsData,
  MoodStatsData,
} from "../../../types/StatsTypes";
import {
  getDateRangeForPeriod,
  formatPeriodLabel,
} from "../../../utils/statsHelpers";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";
import { statsConfig } from "../StatsConfig";

interface StatsModalProps {
  config: FieldConfig;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ config, onClose }) => {
  const [period, setPeriod] = useState<StatsPeriod>("week");
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<
    | CounterStatsData
    | IndicatorStatsData
    | StatusStatsData
    | MoodStatsData
    | null
  >(null);

  useEffect(() => {
    loadStats();
  }, [period, config.id]);

  async function loadStats() {
    setLoading(true);
    try {
      const dateRange = getDateRangeForPeriod(period);

      if (config.type === "counter") {
        const counters = await storageProvider.getCountersWithinRange(
          config.id,
          dateRange,
        );
        const values = counters.map((c) => ({
          date: c.eventDate,
          value: c.value,
        }));
        const total = values.reduce((sum, v) => sum + v.value, 0);
        const average = values.length > 0 ? total / values.length : 0;
        const min =
          values.length > 0 ? Math.min(...values.map((v) => v.value)) : 0;
        const max =
          values.length > 0 ? Math.max(...values.map((v) => v.value)) : 0;

        setStatsData({
          period,
          dateRange,
          totalEvents: values.length,
          total,
          average,
          min,
          max,
          values,
        } as CounterStatsData);
      } else if (config.type === "indicator") {
        const indicators = await storageProvider.getIndicatorsWithinRange(
          config.id,
          dateRange,
        );
        const values = indicators.map((i) => ({
          date: i.eventDate,
          value: i.value === 1,
        }));
        const trueCount = values.filter((v) => v.value).length;
        const falseCount = values.length - trueCount;
        const truePercentage =
          values.length > 0 ? (trueCount / values.length) * 100 : 0;
        const falsePercentage = 100 - truePercentage;

        setStatsData({
          period,
          dateRange,
          totalEvents: values.length,
          trueCount,
          falseCount,
          truePercentage,
          falsePercentage,
          values,
        } as IndicatorStatsData);
      } else if (config.type === "status") {
        const statuses = await storageProvider.getStatusWithinRange(
          config.id,
          dateRange,
        );
        const values = statuses.map((s) => ({
          date: s.eventDate,
          value: s.value,
        }));
        const average =
          values.length > 0
            ? values.reduce((sum, v) => sum + v.value, 0) / values.length
            : 0;
        const distribution: Record<number, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };
        values.forEach((v) => {
          distribution[v.value] = (distribution[v.value] || 0) + 1;
        });

        setStatsData({
          period,
          dateRange,
          totalEvents: values.length,
          average,
          distribution,
          values,
        } as StatusStatsData);
      } else if (config.type === "mood") {
        const moods = await storageProvider.getMoodsWithinRange(
          config.id,
          dateRange,
        );
        const values = moods.map((m) => ({
          date: m.eventDate,
          value: m.value,
        }));
        const distribution: Record<string, number> = {};
        values.forEach((v) => {
          distribution[v.value] = (distribution[v.value] || 0) + 1;
        });
        const mostFrequent =
          Object.entries(distribution).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          "";

        setStatsData({
          period,
          dateRange,
          totalEvents: values.length,
          distribution,
          mostFrequent,
          values,
        } as MoodStatsData);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }

  const statsConfigItem = statsConfig[config.type];
  const StatsComponent = statsConfigItem?.component;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-4 border-black rounded-2xl shadow-neo-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neo-yellow border-b-4 border-black p-6 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Statistiques</h2>
              <p className="font-bold text-gray-600">{config.label}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white border-2 border-black rounded-lg font-black text-xl hover:bg-neo-orange transition-colors shadow-neo-sm"
            >
              ×
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            {(["week", "month", "year"] as StatsPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 border-2 border-black rounded-lg font-bold transition-colors shadow-neo-sm ${
                  period === p ? "bg-neo-cyan" : "bg-white hover:bg-neo-cyan/50"
                }`}
              >
                {formatPeriodLabel(p)}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-600 font-bold">Chargement...</div>
            </div>
          ) : statsData && StatsComponent ? (
            <Suspense
              fallback={
                <div className="text-center py-12 text-gray-600 font-bold">
                  Chargement...
                </div>
              }
            >
              <StatsComponent data={statsData} />
            </Suspense>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-600 font-bold">
                Aucune donnée disponible
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
