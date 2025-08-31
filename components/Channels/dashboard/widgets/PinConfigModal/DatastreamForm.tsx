"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  Tab,
  Tabs,
  Alert,
} from "@mui/material";
import { DatastreamFormProps, PinConfig } from "@/types/pin-config";
import { generatePinOptions } from "@/app/utils/pin-config.utils";

const DatastreamForm: React.FC<DatastreamFormProps> = ({
  config,
  widget,
  onConfigChange,
  onCancel,
  onSubmit,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [datastreamName, setDatastreamName] = useState("");
  const [datastreamAlias, setDatastreamAlias] = useState("");
  const [selectedPin, setSelectedPin] = useState(config.pinNumber || "");
  const [selectedDataType, setSelectedDataType] = useState(
    config.valueType || "Integer",
  );
  const [automationType, setAutomationType] = useState(
    config.automationType || "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-generate alias from name
    if (datastreamName && !datastreamAlias) {
      setDatastreamAlias(datastreamName.toLowerCase().replace(/\s+/g, "_"));
    }
  }, [datastreamName, datastreamAlias]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!datastreamName.trim()) {
      newErrors.name = "Datastream name is required";
    }

    if (!selectedPin) {
      newErrors.pin = "Pin selection is required";
    }

    if (!selectedDataType) {
      newErrors.dataType = "Data type is required";
    }

    // Check for automation type if on automation tab
    if (
      currentTab === 1 &&
      automationType &&
      !["POWER_SWITCH", "SWITCH", "RANGE_CONTROL", "SENSOR"].includes(
        automationType,
      )
    ) {
      newErrors.automationType = "Invalid automation type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Map UI data type to internal type
    const valueType =
      selectedDataType === "Integer"
        ? "NUMBER"
        : (selectedDataType as "BOOLEAN" | "STRING");

    const newConfig: PinConfig = {
      ...config,
      widgetId: widget.id,
      deviceId: widget.deviceId!,
      pinNumber: selectedPin,
      valueType,
      pinType: config.pinType || "VIRTUAL",
      automationType:
        currentTab === 1
          ? (automationType as PinConfig["automationType"])
          : undefined,
      // Ensure title is always a string
      title: config.title ?? datastreamName ?? "",
      // Store the datastream metadata for potential API calls
      datastreamName,
      datastreamAlias,
      defaultValue:
        config.defaultValue !== undefined
          ? config.defaultValue
          : selectedDataType === "Integer"
            ? 0
            : selectedDataType === "BOOLEAN"
              ? false
              : "",
    };

    onConfigChange(newConfig);

    // Call onSubmit with the new configuration
    onSubmit(newConfig);
  };

  const handlePinChange = (pinValue: string) => {
    setSelectedPin(pinValue);
    setErrors((prev) => ({ ...prev, pin: "" }));
  };

  const handleDataTypeChange = (dataType: string) => {
    setSelectedDataType(dataType);
    setErrors((prev) => ({ ...prev, dataType: "" }));
  };

  const handleNameChange = (name: string) => {
    setDatastreamName(name);
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Create New Datastream</h3>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="General" />
          <Tab label="Expose to Automations" />
        </Tabs>
      </Box>

      {currentTab === 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">NAME *</label>
              <div className="flex items-center">
                <div className="mr-2">
                  <button
                    type="button"
                    className="p-1 border rounded hover:bg-gray-100"
                    title="Drag to reorder"
                  >
                    ≡
                  </button>
                </div>
                <TextField
                  fullWidth
                  value={datastreamName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name}
                  placeholder="Enter datastream name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ALIAS</label>
              <TextField
                fullWidth
                value={datastreamAlias}
                onChange={(e) => setDatastreamAlias(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Auto-generated from name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">PIN *</label>
              <Select
                fullWidth
                native
                value={selectedPin}
                onChange={(e) => handlePinChange(e.target.value as string)}
                size="small"
                error={!!errors.pin}
              >
                <option value="">Select Pin</option>
                {generatePinOptions(config.pinType || "VIRTUAL").map((pin) => (
                  <option key={pin} value={pin}>
                    {pin}
                  </option>
                ))}
              </Select>
              {errors.pin && (
                <p className="text-sm text-red-600 mt-1">{errors.pin}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                DATA TYPE *
              </label>
              <Select
                fullWidth
                native
                value={selectedDataType}
                onChange={(e) => handleDataTypeChange(e.target.value)}
                size="small"
                error={!!errors.dataType}
              >
                <option value="Integer">Integer</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="STRING">String</option>
              </Select>
              {errors.dataType && (
                <p className="text-sm text-red-600 mt-1">{errors.dataType}</p>
              )}
            </div>
          </div>

          {/* Show data type specific hints */}
          <div className="mb-4">
            {selectedDataType === "Integer" && (
              <Alert severity="info" className="mb-2">
                Integer datastreams can store numeric values and work with
                sliders, gauges, and numeric displays.
              </Alert>
            )}
            {selectedDataType === "BOOLEAN" && (
              <Alert severity="info" className="mb-2">
                Boolean datastreams store true/false values and work with
                switches, toggles, and LEDs.
              </Alert>
            )}
            {selectedDataType === "STRING" && (
              <Alert severity="info" className="mb-2">
                String datastreams can store text values and work with labels
                and text inputs.
              </Alert>
            )}
          </div>
        </>
      )}

      {currentTab === 1 && (
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              AUTOMATION TYPE
            </label>
            <Select
              fullWidth
              native
              value={automationType}
              onChange={(e) => setAutomationType(e.target.value)}
              size="small"
              error={!!errors.automationType}
            >
              <option value="">Select Automation Type (Optional)</option>
              <option value="POWER_SWITCH">Power Switch</option>
              <option value="SWITCH">Switch</option>
              <option value="RANGE_CONTROL">Range Control</option>
              <option value="SENSOR">Sensor</option>
            </Select>
            {errors.automationType && (
              <p className="text-sm text-red-600 mt-1">
                {errors.automationType}
              </p>
            )}
          </div>

          <Alert severity="info" className="mb-4">
            <strong>Automation Integration:</strong>
            <ul className="mt-2 ml-4 list-disc">
              <li>
                <strong>Power Switch:</strong> Can be turned on/off by
                automations
              </li>
              <li>
                <strong>Switch:</strong> Generic switch control for automations
              </li>
              <li>
                <strong>Range Control:</strong> Numeric value that can be
                adjusted by automations
              </li>
              <li>
                <strong>Sensor:</strong> Read-only value that can trigger
                automation conditions
              </li>
            </ul>
          </Alert>

          {automationType && (
            <p className="text-sm text-green-600 mb-4">
              ✓ This datastream will be available for use in automation rules
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end mt-6 pt-4 border-t">
        <Button
          variant="outlined"
          onClick={() => {
            setErrors({});
            onCancel();
          }}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="bg-teal-500 hover:bg-teal-600"
          disabled={!datastreamName.trim() || !selectedPin || !selectedDataType}
        >
          Create Datastream
        </Button>
      </div>
    </div>
  );
};

export default DatastreamForm;
