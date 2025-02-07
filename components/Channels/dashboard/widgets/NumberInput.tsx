import React from "react";
import TextField from "@mui/material/TextField";

import type { WidgetSettings } from "@/types/widgets";

interface Props {
  settings: WidgetSettings;
  onChange: (settings: WidgetSettings) => void;
}

export const NumberInput: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {settings.label || "Number Input"}
      </label>
      <TextField
        type="number"
        value={settings.value || 0}
        onChange={(e) =>
          onChange({ ...settings, value: parseFloat(e.target.value) })
        }
        className="w-full"
      />
    </div>
  );
};
