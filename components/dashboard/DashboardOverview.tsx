"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Heading, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
// material-ui
import Grid from "@mui/material/Grid";

// project imports
import UserActivityOverviewCard from "@/components/dashboard/Overview/UserActivityOverviewCard";
import OrganizarionOverviewCard from "@/components/dashboard/Overview/OrganizarionOverviewCard";
import TotalDatGeneratedLightCard from "@/components/dashboard/Overview/TotalDatGeneratedLightCard";
import TotalGrowthBarChart from "@/components/dashboard/Overview/TotalGrowthBarChart";

import { gridSpacing } from "@/app/store/constant";

// assets
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

// ==============================|| DEFAULT DASHBOARD ||============================== //

interface Organization {
  areaOfInterest: string;
  createdAt: Date;
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
  userId: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar: string;
  access: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardOverviewProps {
  organization: Organization | null;
  members: Member[] | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  organization,
  members,
}) => {
  const { status, data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  if (status !== "loading" && status === "unauthenticated") {
    return redirect("/login");
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <div className="bg-orange-200 p-5 rounded-lg shadow-md mx-5 xs:mx-0">
              <div>
                <Heading as="h1" className="text-2xl font-bold mb-5">
                  {getGreeting()}, {session!.user!.name}
                </Heading>
                <Text className="text-gray-600">
                  Welcome to your personalized IoT Data Hub dashboard. Here, you
                  can manage your devices, monitor data, and stay connected.
                </Text>
              </div>
            </div>
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <OrganizarionOverviewCard
                  isLoading={isLoading}
                  organization={organization}
                  members={members}
                />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalDatGeneratedLightCard
                  {...{
                    isLoading: isLoading,
                    total: 12,
                    label: "3 Channels",
                    icon: <InsightsOutlinedIcon fontSize="inherit" />,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserActivityOverviewCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
