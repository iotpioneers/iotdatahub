"use client";

import React from "react";
import { Button } from "@mui/material";
import { Save, Cancel, Warning, CheckCircle } from "@mui/icons-material";
import { WidgetStateStats } from "@/types/widget-state";

interface DeviceHeaderComponentProps {
  deviceId: string;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
  isDirty: boolean;
  stats: WidgetStateStats;
}

const DeviceHeaderComponent: React.FC<DeviceHeaderComponentProps> = ({
  deviceId,
  isLoading,
  onSave,
  onCancel,
  isDirty,
  stats,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Status and Stats */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isDirty ? (
              <Warning className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {isDirty ? "Unsaved Changes" : "All Changes Saved"}
            </span>
          </div>

          {/* Change Statistics */}
          {isDirty && (
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {stats.newWidgets > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  +{stats.newWidgets} new
                </span>
              )}
              {stats.modifiedWidgets > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {stats.modifiedWidgets} modified
                </span>
              )}
              {stats.deletedWidgets > 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                  {stats.deletedWidgets} deleted
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            startIcon={<Cancel />}
            className="text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={onSave}
            disabled={isLoading}
            startIcon={<Save />}
            className={`${
              isDirty
                ? "bg-teal-500 hover:bg-teal-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Saving..." : "Save & Apply"}
          </Button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-2 text-xs text-gray-500">
        Total widgets: {stats.totalWidgets}
        {isDirty && (
          <span className="ml-4">
            Remember to save your changes before leaving this page
          </span>
        )}
      </div>
    </div>
  );
};

export default DeviceHeaderComponent;
