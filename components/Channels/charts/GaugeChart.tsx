import * as React from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";
import { ResponsiveContainer } from "recharts";

interface DataPointProps {
  id: string;
  timestamp: string;
  value: number;
}

interface GaugeChartProps {
  chartData?: DataPointProps[];
}

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

const GaugeChart = ({ chartData = [] }: GaugeChartProps) => {
  let data = chartData.map((dataPoint) => {
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

  // Use the latest data point for the gauge value
  const latestValue = data[data.length - 1].value;

  // Define your data range
  const minValue = 0;
  const maxValue = 1000; // Adjust this based on your data range

  // Calculate the percentage for the gauge
  const gaugeValue = ((latestValue - minValue) / (maxValue - minValue)) * 100;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <GaugeContainer startAngle={-110} endAngle={110} value={gaugeValue}>
        <GaugeReferenceArc />
        <GaugeValueArc />
        <GaugePointer />
        {/* Display the value at the center of the gauge */}
        <text
          x="50%"
          y="75%"
          textAnchor="middle"
          fontSize="30px"
          fill="black"
          dominantBaseline="middle"
        >
          {Math.round(latestValue)}
        </text>
      </GaugeContainer>
    </ResponsiveContainer>
  );
};

export default GaugeChart;
