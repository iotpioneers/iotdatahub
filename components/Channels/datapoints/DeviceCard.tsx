"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Device, WidgetData } from "./channel-types";
import { getDeviceIcon, getStatusConfig } from "./channel-utils";
import StatusBadge from "./StatusBadge";
import DeviceWidgetCard from "./DeviceWidgetCard";

interface DeviceCardProps {
  device: Device;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  widgetData: Record<string, WidgetData>;
}

/**
 * Collapsible card showing a device header and its widget grid when expanded.
 * @param props - DeviceCardProps
 */
export default function DeviceCard({
  device,
  index,
  isExpanded,
  onToggle,
  widgetData,
}: DeviceCardProps): JSX.Element {
  const statusConfig = getStatusConfig(device.status);

  // Get all widgets for this specific device
  const deviceWidgets = Object.values(widgetData).filter(
    (widget) => widget.deviceId === device.id,
  );

  const hasWidgetData = deviceWidgets.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-primary/5 border-primary/10 rounded-2xl overflow-hidden"
      role="region"
      aria-label={`Device: ${device.name}`}
    >
      {/* Header toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors duration-200"
        aria-expanded={isExpanded}
        aria-controls={`device-widgets-${device.id}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${device.status === "ONLINE" ? "bg-sky-500/10" : "bg-slate-800"}`}
          >
            {getDeviceIcon(device.name)}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-semibold text-white">
                {device.name}
              </h3>
              <StatusBadge status={device.status} />
            </div>
            {device.description && (
              <p className="text-xs text-slate-500 mt-0.5">
                {device.description}
              </p>
            )}
          </div>
        </div>

        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="w-4 h-4 text-slate-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Widget grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`device-widgets-${device.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="border-t border-white/[0.04] pt-4">
                {hasWidgetData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {deviceWidgets.map((widget: WidgetData, i) => (
                      <DeviceWidgetCard
                        key={widget.widgetId}
                        device={device}
                        widgetData={widget}
                        index={i}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border p-6 text-center bg-slate-800/50 border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400">
                      No widget data configured
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      Add widgets to this device to see data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
