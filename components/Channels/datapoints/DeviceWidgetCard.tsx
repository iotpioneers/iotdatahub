"use client";

import { motion } from "framer-motion";
import { Device, WidgetData } from "./channel-types";
import SparklineChart from "./SparklineChart";
import StatusBadge from "./StatusBadge";

interface DeviceWidgetCardProps {
  device: Device;
  widgetData: WidgetData;
  index: number;
}

/**
 * Renders a single sensor widget card with value, delta indicator, and sparkline.
 * @param props - DeviceWidgetCardProps
 */
export default function DeviceWidgetCard({
  device,
  widgetData,
  index,
}: DeviceWidgetCardProps): JSX.Element {
  const latestValue = widgetData.values[widgetData.values.length - 1] ?? 0;
  const prevValue =
    widgetData.values[widgetData.values.length - 2] ?? latestValue;
  const delta = latestValue - prevValue;
  const isOnline = device.status === "ONLINE";
  const isMotion = widgetData.widgetName?.toLowerCase().includes("motion");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative bg-[#111827] border border-white/[0.06] rounded-2xl p-4 overflow-hidden group hover:border-sky-500/30 hover:shadow-lg hover:shadow-sky-500/5 transition-all duration-300"
      role="article"
      aria-label={`${device.name} — ${widgetData.widgetName} widget`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 relative">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
            {widgetData.widgetName}
          </p>
          <div className="flex items-end gap-1.5">
            <span className="text-2xl font-bold text-white tabular-nums">
              {isMotion
                ? latestValue
                  ? "Active"
                  : "None"
                : latestValue.toFixed(1)}
            </span>
            {widgetData.unit && !isMotion && (
              <span className="text-slate-400 text-sm mb-0.5">
                {widgetData.unit}
              </span>
            )}
          </div>
          {delta !== 0 && !isMotion && (
            <div
              className={`flex items-center gap-1 mt-0.5 text-xs font-medium ${delta > 0 ? "text-emerald-400" : "text-rose-400"}`}
            >
              <span>{delta > 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(delta).toFixed(1)}</span>
            </div>
          )}
        </div>
        <StatusBadge status={device.status} />
      </div>

      {/* Sparkline - Show even if offline as long as we have data */}
      {widgetData.values.length > 0 ? (
        <div className="h-12 -mx-1">
          <SparklineChart
            values={widgetData.values}
            color="#38bdf8"
            height={48}
          />
        </div>
      ) : (
        <div className="h-12 flex items-center justify-center text-slate-600 text-xs">
          No data available
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-xs text-slate-600 font-mono">
          {widgetData.labels[widgetData.labels.length - 1] ?? "--:--"}
        </span>
        <span className="text-xs text-slate-600">Last reading</span>
      </div>
    </motion.div>
  );
}
