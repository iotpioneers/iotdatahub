import React, { useMemo } from "react";
import { Card, CardContent, Chip, Typography, Stack } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
  const colorPalette = {
    "Data Received": theme.palette.primary.main,
    "Field Created": theme.palette.secondary.main,
    "Channel Created": theme.palette.error.main,
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
    return <Typography>Loading...</Typography>;
  }

  if (!aggregatedData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Channel Activity Overview
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalInteractions.toLocaleString()}
            </Typography>
            <Chip
              size="small"
              color={percentageChange >= 0 ? "success" : "error"}
              label={`${
                percentageChange >= 0 ? "+" : ""
              }${percentageChange.toFixed(1)}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total channels interactions in the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          xAxis={
            [
              {
                scaleType: "band",
                categoryGapRatio: 0.5,
                data: last6Months,
              },
            ] as any
          }
          series={[
            {
              id: "data-received",
              label: "Data Received",
              data: aggregatedData.map((d) => d["Data Received"]),
              color: colorPalette["Data Received"],
            },
            {
              id: "field-created",
              label: "Field Created",
              data: aggregatedData.map((d) => d["Field Created"]),
              color: colorPalette["Field Created"],
            },
            {
              id: "channel-created",
              label: "Channel Created",
              data: aggregatedData.map((d) => d["Channel Created"]),
              color: colorPalette["Channel Created"],
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
              position: { vertical: "top", horizontal: "right" },
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
