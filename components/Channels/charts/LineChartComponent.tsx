import React from "react";
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
import { date } from "zod";

interface DataPointProps {
  id: string;
  timestamp: string;
  value: number;
}

interface LineChartProps {
  chartData?: DataPointProps[];
  field?: string;
}

const LineChartComponent = ({ chartData = [], field = "" }: LineChartProps) => {
  let data = [];

  data = chartData.map((dataPoint) => {
    const formatDate = (date: string) =>
      new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
      }).format(new Date(date));

    return {
      key: dataPoint.id,
      timestamp: formatDate(dataPoint.timestamp),
      value: dataPoint.value,
    };
  });

  if (data.length === 0) {
    data = [
      {
        key: "1",
        timestamp: new Date().toDateString(),
        value: 0,
      },
    ];
  }

  return (
    <div>
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
