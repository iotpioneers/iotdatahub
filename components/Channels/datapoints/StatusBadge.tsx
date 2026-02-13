"use client";

import { DeviceStatus } from "./channel-types";
import { getStatusConfig } from "./channel-utils";

interface StatusBadgeProps {
  status: DeviceStatus;
}

/**
 * Animated status pill badge for a device.
 * @param props - StatusBadgeProps
 */
export default function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  const config = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
      aria-label={`Device status: ${config.label}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === "ONLINE" ? "animate-pulse" : ""}`}
      />
      {config.label}
    </span>
  );
}
