"use client";

import { motion } from "framer-motion";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import { Channel } from "./channel-types";
import { dateConverter } from "@/lib/utils";
import ExportChannelData from "../ExportChannelData";

interface ChannelHeaderProps {
  channel: Channel;
  channelName: string;
  dataPointCount: number;
  onRefresh: () => void;
  collaborationSection?: React.ReactNode;
  headingComponent?: React.ReactNode;
}

/**
 * Channel page header with breadcrumb, metadata, and actions
 */
export default function ChannelHeader({
  channel,
  channelName,
  dataPointCount,
  onRefresh,
  collaborationSection,
  headingComponent,
}: ChannelHeaderProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary/5 border-primary/10 rounded-2xl p-6"
    >
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-slate-500 mb-4 flex-wrap"
      >
        <a href="/dashboard" className="hover:text-slate-300 transition-colors">
          Dashboard
        </a>
        <span aria-hidden="true">›</span>
        <a
          href="/dashboard/channels"
          className="hover:text-slate-300 transition-colors"
        >
          Channels
        </a>
        <span aria-hidden="true">›</span>
        <span className="text-sky-400 font-medium">{channelName}</span>
      </nav>

      {/* Main header content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl flex-shrink-0"
            aria-hidden="true"
          >
            📡
          </div>
          <div>{headingComponent}</div>
        </div>

        <div className="grid">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  channel.access === "PUBLIC"
                    ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                    : "bg-slate-400/10 border-slate-400/20 text-slate-400"
                }`}
              >
                {channel.access === "PUBLIC" ? "🌐 Public" : "🔒 Private"}
              </span>
              <button
                onClick={onRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] text-slate-400 hover:text-white transition-all duration-200"
                aria-label="Refresh channel data"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {collaborationSection && (
            <div className="flex justify-between items-center my-5">
              {collaborationSection}
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-center mt-4">
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="flex flex-col">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <ChartPieIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              Generated {dataPointCount} data
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <CalendarIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              Created about {dateConverter(channel.createdAt.toString())}
            </div>
          </div>
        </div>
        <div>
          <ExportChannelData channelId={channel.id} />
        </div>
      </div>
    </motion.div>
  );
}
