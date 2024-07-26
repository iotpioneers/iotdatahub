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
      {data.length === 0 && (
        <div className="text-center text-gray-500">No data available</div>
      )}
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
