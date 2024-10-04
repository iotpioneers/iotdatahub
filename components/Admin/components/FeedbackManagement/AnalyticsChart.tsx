import React from "react";
import useSWR from "swr";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

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

// AnalyticsChart component using the provided template structure
const AnalyticsChart = () => {
  const { data, error } = useSWR<FeedbackAnalytics[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    fetcher
  );

  if (error) return <div>Failed to load analytics</div>;
  if (!data) return <div>Loading analytics...</div>;

  // Prepare dataset for the chart
  const dataset = [
    {
      status: "Feedback",
      pending: getCountForStatus(data, FeedbackStatus.PENDING),
      inProgress: getCountForStatus(data, FeedbackStatus.IN_PROGRESS),
      resolved: getCountForStatus(data, FeedbackStatus.RESOLVED),
      closed: getCountForStatus(data, FeedbackStatus.CLOSED),
    },
  ];

  // Updated value formatter to handle both number and null values
  const valueFormatter = (value: number | null) => {
    if (value === null) {
      return "No data";
    }
    return `${value} feedbacks`;
  };

  // Chart settings
  const chartSetting = {
    yAxis: [
      {
        label: "Feedback Count",
      },
    ],
    width: 500,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "status" }]}
      series={[
        {
          dataKey: "pending",
          label: "Pending",
          valueFormatter,
          color: "#FF6384",
        },
        {
          dataKey: "inProgress",
          label: "In Progress",
          valueFormatter,
          color: "#36A2EB",
        },
        {
          dataKey: "resolved",
          label: "Resolved",
          valueFormatter,
          color: "#FFCE56",
        },
        {
          dataKey: "closed",
          label: "Closed",
          valueFormatter,
          color: "#4BC0C0",
        },
      ]}
      {...chartSetting}
    />
  );
};

export default AnalyticsChart;
