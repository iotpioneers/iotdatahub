"use client";

import { motion } from "framer-motion";
import { Channel, Device, StatItem } from "./channel-types";

interface ChannelStatsHeaderProps {
  channel: Channel;
}

/**
 * Displays a 4-up stat summary for the channel (devices, fields, health, access).
 */
export default function ChannelStatsHeader({
  channel,
}: ChannelStatsHeaderProps): JSX.Element {
  const onlineCount = channel.devices.filter(
    (d: Device) => d.status === "ONLINE",
  ).length;
  const totalDevices = channel.devices.length;
  const healthPercent =
    totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 0;

  const stats: StatItem[] = [
    { label: "Devices", value: totalDevices, sub: `${onlineCount} online` },
    { label: "Fields", value: channel.fields.length, sub: "data streams" },
    { label: "Health", value: `${healthPercent}%`, sub: "uptime rate" },
    { label: "Access", value: channel.access, sub: "visibility" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat: StatItem, i: number) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="bg-primary/5 border-primary/10 rounded-xl p-4"
        >
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
            {stat.label}
          </p>
          <p className="text-xl font-bold text-yellow-500 tabular-nums">
            {stat.value}
          </p>
          {stat.sub && (
            <p className="text-xs text-green-600 mt-0.5">{stat.sub}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
