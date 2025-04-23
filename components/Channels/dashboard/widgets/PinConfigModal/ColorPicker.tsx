"use client";

import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { ColorPickerProps } from "@/types/pin-config";
import { colorOptions } from "@/app/utils/pin-config.utils";

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="border rounded-md p-4 relative">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Theme" />
          <Tab label="Complimentary" />
          <Tab label="Neutrals" />
        </Tabs>
      </Box>

      <div className="grid grid-cols-7 gap-2">
        {Object.entries(colorOptions).map(
          ([group, colors], groupIndex) =>
            groupIndex === currentTab &&
            colors.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-md border-2 ${value === color ? "border-gray-900" : "border-transparent"}`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            )),
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
