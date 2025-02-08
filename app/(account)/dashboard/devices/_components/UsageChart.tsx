import { Card, CardHeader, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface UsageChartProps {
  data: Array<{ time: string; value: number }>;
  title: string;
  unit: string;
}

export const UsageChart = ({ data, title, unit }: UsageChartProps) => {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white text-lg">Usage Status</h3>
        <select className="bg-zinc-800 text-white rounded-md px-3 py-1">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" axisLine={false} tick={{ fill: "#9CA3AF" }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 4 ? "#3B82F6" : "#374151"} // Highlight specific bar
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-gray-900 text-md">
        <span>Total: 35.02kWh</span>
        <span>32h</span>
      </div>
    </div>
  );
};
