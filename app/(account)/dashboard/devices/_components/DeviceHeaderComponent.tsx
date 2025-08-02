"use client";

import React from "react";
import { Button } from "@mui/material";
import { Save, X, AlertCircle, Clock } from "lucide-react";

interface DeviceHeaderComponentProps {
  deviceId: string;
  isLoading: boolean;
  onSave: () => void;
  onCancel: () => void;
  isDirty?: boolean;
}

const DeviceHeaderComponent: React.FC<DeviceHeaderComponentProps> = ({
  deviceId,
  isLoading,
  onSave,
  onCancel,
  isDirty = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Left side - Status indicators */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Edit Dashboard
          </h1>

          {/* Dirty state indicator */}
          {isDirty && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-orange-700">
                Unsaved changes
              </span>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-blue-700">
                Saving...
              </span>
            </div>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center space-x-3">
          {/* Help text */}
          {!isDirty && !isLoading && (
            <p className="text-sm text-gray-500 mr-4">
              Drag widgets from the left panel or double-click to add
            </p>
          )}

          {/* Cancel button */}
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            startIcon={<X className="w-4 h-4" />}
            className="border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            size="medium"
          >
            Cancel
          </Button>

          {/* Save button */}
          <Button
            variant="contained"
            onClick={onSave}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )
            }
            className={`${
              isDirty
                ? "bg-teal-500 hover:bg-teal-600 shadow-lg"
                : "bg-gray-400 hover:bg-gray-500"
            } text-white transition-all duration-200`}
            size="medium"
          >
            {isLoading ? "Saving..." : isDirty ? "Save Changes" : "Save"}
          </Button>
        </div>
      </div>

      {/* Auto-save info */}
      {!isDirty && !isLoading && (
        <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          <span>
            Changes are saved locally while editing and persisted when you click
            Save
          </span>
        </div>
      )}
    </div>
  );
};

export default DeviceHeaderComponent;
