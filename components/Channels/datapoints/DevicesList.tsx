"use client";

import { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Device, WidgetData, PaginationInfo } from "./channel-types";
import DeviceCard from "./DeviceCard";
import Pagination from "./Pagination";

interface DevicesListProps {
  devices: Device[];
  widgetData: Record<string, WidgetData>;
  pagination: PaginationInfo | null;
  isLoadingMore?: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
  initialExpandedDevices?: Set<string>;
}

/**
 * Manages the list of devices with search, expand/collapse, and pagination
 */
export default function DevicesList({
  devices,
  widgetData,
  pagination,
  isLoadingMore = false,
  onNextPage,
  onPrevPage,
  onPageChange,
  initialExpandedDevices = new Set(),
}: DevicesListProps): JSX.Element {
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(
    initialExpandedDevices,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleToggleDevice = (deviceId: string): void => {
    setExpandedDevices((prev: Set<string>) => {
      const next = new Set(prev);
      if (next.has(deviceId)) {
        next.delete(deviceId);
      } else {
        next.add(deviceId);
      }
      return next;
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const filteredDevices: Device[] = devices.filter(
    (d: Device) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search devices..."
          value={searchQuery}
          onChange={handleSearchChange}
          aria-label="Search devices"
          className="w-full bg-[#111827] border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20 transition-all duration-200"
        />
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          Connected Devices
          <span className="ml-2 text-xs text-yellow-500 font-normal">
            ({filteredDevices.length})
          </span>
        </h2>
        <button
          onClick={() => {
            if (expandedDevices.size === filteredDevices.length) {
              setExpandedDevices(new Set<string>());
            } else {
              setExpandedDevices(
                new Set<string>(filteredDevices.map((d: Device) => d.id)),
              );
            }
          }}
          className="text-xs text-slate-500 hover:text-sky-400 transition-colors"
        >
          {expandedDevices.size === filteredDevices.length
            ? "Collapse all"
            : "Expand all"}
        </button>
      </div>

      {/* Loading overlay */}
      {isLoadingMore && (
        <div className="relative">
          <div className="absolute inset-0 bg-[#080e17]/80 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-2 text-sky-400">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm font-medium">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {/* Device list */}
      {filteredDevices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-primary/5 border-primary/10 rounded-2xl p-12 text-center"
        >
          <div className="text-4xl mb-3" aria-hidden="true">
            🔍
          </div>
          <p className="text-sm font-medium text-slate-400">No devices found</p>
          <p className="text-xs text-slate-600 mt-1">
            Try a different search term
          </p>
        </motion.div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredDevices.map((device: Device, i: number) => (
              <DeviceCard
                key={device.id}
                device={device}
                index={i}
                isExpanded={expandedDevices.has(device.id)}
                onToggle={() => handleToggleDevice(device.id)}
                widgetData={widgetData}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
              onPageChange={onPageChange}
              isLoading={isLoadingMore}
            />
          )}
        </>
      )}
    </div>
  );
}
