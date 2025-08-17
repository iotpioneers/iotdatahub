import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Tooltip } from "@mui/material";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface DataPointProps {
  id: string;
  timestamp: string;
  value: number;
}

interface GaugeChartProps {
  chartData?: DataPointProps[];
  WidgetType?: "radial" | "semicircle" | "grafana" | undefined;
}

const GaugeWidgetComponent = ({
  chartData = [],
  WidgetType = "radial",
}: GaugeChartProps) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<string | null>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);

  // Get the most recent data point
  const latestDataPoint =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;

  // Use the value from the latest data point, or default to 0
  const currentValue = latestDataPoint ? latestDataPoint.value : 0;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gaugeRef.current || chartData.length === 0) return;

    const rect = gaugeRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate angle from center to mouse position
    const angle =
      Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    // Normalize angle to 0-360 range
    const normalizedAngle = (angle + 360) % 360;
    // Map angle to value (assuming 0 is at -90 degrees and 100 is at 90 degrees)
    const mappedValue = (normalizedAngle + 90) * (100 / 270);

    // Find the closest data point
    const closestDataPoint = chartData.reduce((prev, curr) => {
      return Math.abs(curr.value - mappedValue) <
        Math.abs(prev.value - mappedValue)
        ? curr
        : prev;
    }, chartData[0]);

    setHoveredValue(closestDataPoint.value);
    setHoveredTimestamp(closestDataPoint.timestamp);
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredTimestamp(null);
  };

  return (
    <Tooltip
      title={
        hoveredValue !== null && hoveredTimestamp !== null
          ? `Value: ${hoveredValue.toFixed(2)}, Time: ${new Date(
              hoveredTimestamp,
            ).toLocaleString()}`
          : ""
      }
      open={hoveredValue !== null}
      arrow
    >
      <div
        ref={gaugeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        <GaugeComponent
          value={currentValue}
          type={WidgetType}
          labels={{
            tickLabels: {
              type: "inner",
              ticks: [
                { value: 20 },
                { value: 40 },
                { value: 60 },
                { value: 80 },
                { value: 100 },
              ],
            },
          }}
          arc={{
            colorArray: ["#5BE12C", "#EA4228"],
            subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
            padding: 0.02,
            width: 0.3,
          }}
          pointer={{
            elastic: true,
            animationDelay: 0,
          }}
        />
      </div>
    </Tooltip>
  );
};

export default GaugeWidgetComponent;
