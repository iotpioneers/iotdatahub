import React, { PureComponent } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data01 = [
  { x: 10, y: 30 },
  { x: 30, y: 200 },
  { x: 45, y: 100 },
  { x: 50, y: 400 },
  { x: 70, y: 150 },
  { x: 100, y: 250 },
];

import { DataPointProps } from "@/types";

interface LineChartProps {
  chartData?: DataPointProps[];
  field?: string;
}

const LineChartComponent = ({ chartData = [], field = "" }: LineChartProps) => {
  const data = chartData.map((dataPoint) => {
    const formatDate = (date: string) =>
      new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(date));

    return {
      key: dataPoint.id,
      timestamp: formatDate(dataPoint.timestamp),
      value: dataPoint.value,
    };
  });
  return (
    <div>
      <h2 className="text-2xl font-semibold items-center justify-center mb-5">
        {field}
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="category" dataKey="timestamp" name="timestamp" />
          <YAxis type="number" dataKey="value" name="data_point" />
          <ZAxis type="number" range={[100]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter data={data} fill="#82ca9d" line shape="diamond" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartComponent;
