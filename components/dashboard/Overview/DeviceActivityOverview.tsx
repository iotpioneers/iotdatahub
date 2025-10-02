import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Channel, DataPoint, Field } from "@/types";

interface ChannelActivityOverviewProps {
  isLoading: boolean;
  channels: Channel[] | null;
  fields: Field[] | null;
  dataPoints: DataPoint[] | null;
}

export default function ChannelActivityOverview({
  isLoading,
  channels,
  fields,
  dataPoints,
}: ChannelActivityOverviewProps) {
  const colorPalette = {
    "Data Received": "#3b82f6",
    "Field Created": "#10b981",
    "Channel Created": "#ef4444",
  };

  const last6Months = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push(d.toLocaleString("default", { month: "short" }));
    }
    return months;
  }, []);

  const aggregatedData = useMemo(() => {
    if (!dataPoints || !fields || !channels) return null;

    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

    const monthlyData = last6Months.map((month) => ({
      month,
      "Data Received": 0,
      "Field Created": 0,
      "Channel Created": 0,
    }));

    dataPoints.forEach((dp) => {
      const date = new Date(dp.timestamp);
      if (date >= sixMonthsAgo) {
        const monthIndex = monthlyData.findIndex(
          (m) => m.month === date.toLocaleString("default", { month: "short" })
        );
        if (monthIndex !== -1) {
          monthlyData[monthIndex]["Data Received"] += 1;
        }
      }
    });

    fields.forEach((field) => {
      const date = new Date(field.createdAt);
      if (date >= sixMonthsAgo) {
        const monthIndex = monthlyData.findIndex(
          (m) => m.month === date.toLocaleString("default", { month: "short" })
        );
        if (monthIndex !== -1) {
          monthlyData[monthIndex]["Field Created"] += 1;
        }
      }
    });

    channels.forEach((channel) => {
      const date = new Date(channel.createdAt);
      if (date >= sixMonthsAgo) {
        const monthIndex = monthlyData.findIndex(
          (m) => m.month === date.toLocaleString("default", { month: "short" })
        );
        if (monthIndex !== -1) {
          monthlyData[monthIndex]["Channel Created"] += 1;
        }
      }
    });

    return monthlyData;
  }, [dataPoints, fields, channels, last6Months]);

  const { totalInteractions, percentageChange } = useMemo(() => {
    if (!aggregatedData) return { totalInteractions: 0, percentageChange: 0 };

    const total = aggregatedData.reduce(
      (sum, month) =>
        sum +
        month["Data Received"] +
        month["Field Created"] +
        month["Channel Created"],
      0
    );

    const lastThreeMonths = aggregatedData.slice(-3);
    const previousThreeMonths = aggregatedData.slice(-6, -3);

    const lastThreeMonthsTotal = lastThreeMonths.reduce(
      (sum, month) =>
        sum +
        month["Data Received"] +
        month["Field Created"] +
        month["Channel Created"],
      0
    );

    const previousThreeMonthsTotal = previousThreeMonths.reduce(
      (sum, month) =>
        sum +
        month["Data Received"] +
        month["Field Created"] +
        month["Channel Created"],
      0
    );

    const change =
      ((lastThreeMonthsTotal - previousThreeMonthsTotal) /
        previousThreeMonthsTotal) *
      100;

    return {
      totalInteractions: total,
      percentageChange: previousThreeMonthsTotal > 0 ? change : 0,
    };
  }, [aggregatedData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Connecting...</div>
        </CardContent>
      </Card>
    );
  }

  if (!aggregatedData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Channel Activity Overview
        </CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold">
              {totalInteractions.toLocaleString()}
            </h3>
            <Badge
              variant={percentageChange >= 0 ? "default" : "destructive"}
              className={`${
                percentageChange >= 0
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
            >
              {percentageChange >= 0 ? "+" : ""}
              {percentageChange.toFixed(1)}%
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Total channels interactions in the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={aggregatedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Legend />
              <Bar
                dataKey="Data Received"
                fill={colorPalette["Data Received"]}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Field Created"
                fill={colorPalette["Field Created"]}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Channel Created"
                fill={colorPalette["Channel Created"]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
