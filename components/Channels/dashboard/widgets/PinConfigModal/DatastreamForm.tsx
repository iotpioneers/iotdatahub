"use client";

import React, { useState } from "react";
import { Box, Button, TextField, Select, Tab, Tabs } from "@mui/material";
import { DatastreamFormProps } from "@/types/pin-config";
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSubmit = () => {
    // In a real implementation, validate fields first
    onConfigChange({
      ...config,
      pinNumber: datastreamName.substring(0, 3), // Just for demo
    });
    onSubmit();
  };

  return (
    <div className="border rounded-md p-4 mb-4">
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
              <label className="block text-sm font-medium mb-1">NAME</label>
              <div className="flex items-center">
                <div className="mr-2">
                  <button className="p-1 border rounded">≡</button>
                </div>
                <TextField
                  fullWidth
                  value={datastreamName}
                  onChange={(e) => setDatastreamName(e.target.value)}
                  variant="outlined"
                  size="small"
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">PIN</label>
              <Select
                fullWidth
                native
                value={config.pinNumber || ""}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    pinNumber: e.target.value as string,
                  })
                }
                size="small"
              >
                {generatePinOptions(config.pinType || "VIRTUAL").map((pin) => (
                  <option key={pin} value={pin}>
                    {pin}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                DATA TYPE
              </label>
              <Select
                fullWidth
                native
                value={
                  config.valueType === "NUMBER"
                    ? "Integer"
                    : config.valueType || ""
                }
                onChange={(e) => {
                  const val = e.target.value;
                  onConfigChange({
                    ...config,
                    valueType:
                      val === "Integer"
                        ? "NUMBER"
                        : (val as "BOOLEAN" | "NUMBER" | "STRING"),
                  });
                }}
                size="small"
              >
                <option value="Integer">Integer</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="STRING">String</option>
              </Select>
            </div>
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
              value={config.automationType || ""}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  automationType: e.target.value as
                    | "POWER_SWITCH"
                    | "SWITCH"
                    | "RANGE_CONTROL"
                    | "SENSOR"
                    | "",
                })
              }
              size="small"
            >
              <option value="">Select Datastream</option>
              <option value="POWER_SWITCH">Power Switch</option>
              <option value="SWITCH">Switch</option>
              <option value="RANGE_CONTROL">Range Control</option>
              <option value="SENSOR">Sensor</option>
            </Select>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            This datastream can be used as an Automation condition
          </p>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button variant="outlined" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className="bg-teal-500"
        >
          Create
        </Button>
      </div>
    </div>
  );
};

export default DatastreamForm;
