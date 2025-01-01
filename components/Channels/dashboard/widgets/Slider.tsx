import React from "react";
import { Slider as SliderUI } from "@mui/material";

import type { WidgetSettings } from "@/types/widgets";

interface Props {
  settings: WidgetSettings;
  onChange: (settings: WidgetSettings) => void;
}

export const Slider: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">
        {settings.label || "Slider"}
      </label>
      <SliderUI
        min={settings.min || 0}
        max={settings.max || 100}
        value={settings.value || 0}
        step={settings.step || 1}
        onChange={(event) => {
          if (event.target) {
            onChange({
              ...settings,
              value: parseFloat((event.target as HTMLInputElement).value),
            });
          }
        }}
      />
    </div>
  );
};
