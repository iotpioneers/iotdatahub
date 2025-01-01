import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { WidgetSettings } from "@/types/widgets";

interface Props {
  settings: WidgetSettings;
  onChange: (settings: WidgetSettings) => void;
}

export const Chart: React.FC<Props> = ({ settings }) => {
  return (
    <LineChart
      width={settings.width || 300}
      height={settings.height || 200}
      data={settings.data || []}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
};
