"use client";

interface SparklineChartProps {
  values: number[];
  color?: string;
  height?: number;
}

/**
 * Lightweight SVG sparkline for widget data visualization.
 * @param props - SparklineChartProps
 */
export default function SparklineChart({
  values,
  color = "#38bdf8",
  height = 48,
}: SparklineChartProps): JSX.Element | null {
  if (!values || values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const padding = 4;

  const points: string[] = values.map((v: number, i: number) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints: string = [
    `${padding},${height - padding}`,
    ...points,
    `${width - padding},${height - padding}`,
  ].join(" ");

  const gradientId = `grad-${color.replace("#", "")}`;
  const lastPoint = points[points.length - 1];
  const [lastX, lastY] = lastPoint ? lastPoint.split(",") : ["0", "0"];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}
