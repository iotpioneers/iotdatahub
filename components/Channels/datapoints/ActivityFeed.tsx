"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivityItem, ActivityType } from "./channel-types";
import { dateConverter } from "@/lib/utils";

interface ActivityFeedProps {
  activities: ActivityItem[];
  initialTab?: ActivityType;
}

/**
 * Live activity feed showing active transmissions and recent history.
 * Tabs filter between "active" (currently sending) and "recent" (past uploads).
 */
export default function ActivityFeed({
  activities,
  initialTab = "active",
}: ActivityFeedProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<ActivityType>(initialTab);

  const filtered = activities.filter((a: ActivityItem) => a.type === activeTab);
  const tabs: ActivityType[] = ["active", "recent"];

  return (
    <div className="bg-[#111827] border border-primary/10 rounded-2xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Activity Feed</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live device transmissions
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs text-emerald-400 font-medium">Live</span>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex bg-black/20 rounded-xl p-1 gap-1"
          role="tablist"
          aria-label="Activity filter"
        >
          {tabs.map((tab: ActivityType) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                activeTab === tab
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab === "active" ? "🔴 Active" : "🕐 Recent"}
            </button>
          ))}
        </div>
      </div>

      {/* Feed list */}
      <div
        className="flex-1 overflow-y-auto divide-y divide-white/[0.03]"
        role="tabpanel"
        aria-label={`${activeTab} activities`}
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center"
            >
              <div className="text-3xl mb-2" aria-hidden="true">
                📭
              </div>
              <p className="text-sm text-slate-500">
                No {activeTab} transmissions
              </p>
            </motion.div>
          ) : (
            filtered.map((item: ActivityItem, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors duration-150"
                role="listitem"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 flex-shrink-0" aria-hidden="true">
                    <div
                      className={`w-2 h-2 rounded-full ${item.type === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Breadcrumb path */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1 flex-wrap">
                      <span className="text-sky-400 font-medium truncate">
                        {item.deviceName}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">
                        ›
                      </span>
                      <span className="text-slate-400">{item.fieldName}</span>
                    </div>
                    {/* Value row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white tabular-nums">
                          {item.fieldName === "Motion"
                            ? item.value
                              ? "Triggered"
                              : "Clear"
                            : item.value}
                        </span>
                        {item.unit && (
                          <span className="text-xs text-slate-500">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      <time
                        dateTime={item.timestamp}
                        className="text-xs text-slate-600 flex-shrink-0"
                      >
                        {dateConverter(item.timestamp)}
                      </time>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
