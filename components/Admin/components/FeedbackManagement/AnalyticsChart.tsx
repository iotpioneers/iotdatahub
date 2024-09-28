import React from "react";
import useSWR from "swr";
import { BarChart } from "@mui/x-charts/BarChart";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define FeedbackStatus enum
enum FeedbackStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

// Define a type for the expected data structure
type FeedbackAnalytics = Record<string, any>;

// Helper function to safely get count for a status
const getCountForStatus = (
  data: FeedbackAnalytics[],
  status: FeedbackStatus
): number => {
  return data.filter((item) => item.status === status).length;
};

// AnalyticsChart component
const AnalyticsChart = () => {
  const { data, error } = useSWR<FeedbackAnalytics[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    fetcher
  );

  if (error) return <div>Failed to load analytics</div>;
  if (!data) return <div>Loading analytics...</div>;

  const chartData = Object.values(FeedbackStatus).map((status) =>
    getCountForStatus(data, status as FeedbackStatus)
  );

  return (
    <BarChart
      series={[{ data: chartData }]}
      height={300}
      xAxis={[
        {
          data: Object.values(FeedbackStatus),
          scaleType: "band",
        },
      ]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
};

export default AnalyticsChart;
