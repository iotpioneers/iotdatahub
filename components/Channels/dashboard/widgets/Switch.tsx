import React from "react";
import { Switch as SwitchUI } from "@mui/material";

import type { WidgetSettings } from "@/types/widgets";

interface Props {
  settings: WidgetSettings;
  onChange: (settings: WidgetSettings) => void;
}

export const Switch: React.FC<Props> = ({ settings, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">
        {settings.label || "Switch"}
      </label>
      <SwitchUI
        checked={settings.value ? true : false}
        onChange={(checked) => onChange({ ...settings, checked })}
      />
    </div>
  );
};
