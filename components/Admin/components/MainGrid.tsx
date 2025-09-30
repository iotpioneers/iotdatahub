"use client";

import * as React from "react";
import axios from "axios";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Copyright from "../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import PlatformNavigationTreeView from "./PlatformNavigationTreeView";
import CustomizedDataGrid from "./CustomizedDataGrid";
import HighlightedCard from "./HighlightedCard";
import PlatformActivityChart from "./PlatformActivityChart";
import StatCard, { StatCardProps } from "./StatCard";
import { UserData } from "@/types/user";
import { Channel, Device, Organization } from "@/types/uni-types";

interface OverviewData {
  users: UserData[];
  organizations: Organization[];
  devices: Device[];
  channels: Channel[];
}

export default function MainGrid() {
  const [loading, setLoading] = React.useState(true);
  const [overviewData, setOverviewData] = React.useState<OverviewData | null>(
    null
  );

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<OverviewData>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/overview`
        );
        setOverviewData(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!overviewData) {
    return <Typography>Error loading data. Please try again later.</Typography>;
  }

  const statCards: StatCardProps[] = [
    {
      title: "Users",
      value: overviewData.users.length.toString(),
      interval: "Total",
      trend: "up",
      data: overviewData.users.map((_, index) => Math.random() * 1000), // Replace with actual trend data if available
    },
    {
      title: "Organizations",
      value: overviewData.organizations.length.toString(),
      interval: "Total",
      trend: "neutral",
      data: overviewData.organizations.map((_, index) => Math.random() * 1000), // Replace with actual trend data if available
    },
    {
      title: "Devices",
      value: overviewData.devices.length.toString(),
      interval: "Total",
      trend: "up",
      data: overviewData.devices.map((_, index) => Math.random() * 1000), // Replace with actual trend data if available
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {statCards.map((card, index) => (
          <Grid key={index} xs={12} sm={6} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid xs={12} sm={6} lg={3}>
          <HighlightedCard />
        </Grid>
        <Grid xs={12} md={6}>
          <PlatformActivityChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid md={12} lg={9}>
          <CustomizedDataGrid />
        </Grid>
        <Grid xs={12} lg={3}>
          <Stack gap={2} direction={{ xs: "column", sm: "row", lg: "column" }}>
            <PlatformNavigationTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
