import React from "react";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { DataPointProps } from "@/types";

interface LineChartProps {
  chartData: DataPointProps[];
}

const LineChartComponent = ({ chartData }: LineChartProps) => {
  const isSmallScreens = useMediaQuery("(max-width: 480px)");

  const data = chartData.map((dataPoint) => {
    const formatDate = (date: string) =>
      new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(date));

    const formatHours = (date: string) => {
      const parsedDate = new Date(date);
      const hours = parsedDate.getHours().toString().padStart(2, "0"); // Add leading zero if needed
      return hours;
    };

    return {
      key: dataPoint.id,
      timestamp: formatDate(dataPoint.timestamp),
      value: dataPoint.value,
    };
  });

  return (
    <LineChart
      width={isSmallScreens ? 300 : 500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#0000ff" strokeWidth={2} />
      <Brush />
    </LineChart>
  );
};

export default LineChartComponent;
