import { DeviceStatus, StatusConfig } from "./channel-types";

/**
 * Formats a timestamp into a human-readable relative string.
 * @param timestamp - ISO timestamp string
 * @returns Human-readable time ago string
 */
export function formatTimeAgo(timestamp: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(timestamp).getTime()) / 1000,
  );
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Returns display config for a given device status.
 * @param status - The DeviceStatus enum value
 * @returns StatusConfig object with Tailwind class strings and label
 */
export function getStatusConfig(status: DeviceStatus): StatusConfig {
  switch (status) {
    case "ONLINE":
      return {
        color: "text-emerald-400",
        bg: "bg-emerald-400/10 border-emerald-400/30",
        label: "Online",
        dot: "bg-emerald-400",
      };
    case "OFFLINE":
      return {
        color: "text-slate-400",
        bg: "bg-slate-400/10 border-slate-400/30",
        label: "Offline",
        dot: "bg-slate-400",
      };
    case "DISCONNECTED":
      return {
        color: "text-amber-400",
        bg: "bg-amber-400/10 border-amber-400/30",
        label: "Disconnected",
        dot: "bg-amber-400",
      };
    default:
      return {
        color: "text-slate-400",
        bg: "bg-slate-400/10 border-slate-400/30",
        label: "Unknown",
        dot: "bg-slate-400",
      };
  }
}

/**
 * Returns an emoji icon based on the device's name.
 * @param name - Device name string
 * @returns Emoji string representing the device type
 */
export function getDeviceIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("hub") || lower.includes("control")) return "🏠";
  if (lower.includes("kitchen") || lower.includes("sensor")) return "🌡️";
  if (lower.includes("bedroom") || lower.includes("sleep")) return "🛏️";
  if (lower.includes("garage") || lower.includes("door")) return "🚗";
  if (lower.includes("garden") || lower.includes("outdoor")) return "🌿";
  if (lower.includes("camera")) return "📹";
  return "📡";
}
