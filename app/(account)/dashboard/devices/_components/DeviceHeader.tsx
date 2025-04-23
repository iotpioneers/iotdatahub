"use client";

import React, { useState } from "react";
import { Info, Bell, Settings, Download, MoreHorizontal } from "lucide-react";
import { Tab, Tabs, ToggleButton } from "@mui/material";

interface DeviceHeaderProps {
  device: any;
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}

const durations = [
  { value: "1h", label: "1h" },
  { value: "6h", label: "6h" },
  { value: "1d", label: "1d" },
  { value: "1w", label: "1w" },
  { value: "1mo", label: "1mo" },
  { value: "3mo", label: "3mo" },
];

const DeviceHeader: React.FC<DeviceHeaderProps> = ({
  device,
  selectedDuration,
  onDurationChange,
}) => {
  const [showMap, setShowMap] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="border-b border-gray-200">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">Device Name</h2>
          <span className="ml-2 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
            <span className="text-xs text-gray-500">Online</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Info size={18} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={18} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={18} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Download size={18} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 flex justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <span className="text-sm mr-2">Device Owner:</span>
            <span className="text-sm font-medium">User Name</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm mr-2">Company Name:</span>
            <span className="text-sm font-medium">Company XYZ</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex items-center">
            <span className="text-sm mr-2">Show map</span>
            <ToggleButton
              value="check"
              selected={showMap}
              onChange={() => setShowMap(!showMap)}
              size="small"
              style={{
                borderRadius: "16px",
                padding: "4px 8px",
                backgroundColor: showMap ? "#10b981" : undefined,
                color: showMap ? "white" : undefined,
              }}
            >
              {showMap ? "On" : "Off"}
            </ToggleButton>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 pb-2">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="dashboard tabs"
        >
          <Tab label="Dashboard" />
          <Tab
            icon={<span className="text-xl">+</span>}
            aria-label="add dashboard"
          />
        </Tabs>

        <div className="flex border rounded-md overflow-hidden">
          {durations.map((duration) => (
            <button
              key={duration.value}
              className={`px-3 py-1 text-sm ${
                selectedDuration === duration.value
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => onDurationChange(duration.value)}
            >
              {duration.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceHeader;
