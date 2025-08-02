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
      </div>
    </div>
  );
};

export default DeviceHeader;
