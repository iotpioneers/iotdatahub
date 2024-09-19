"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// material-ui
import Grid from "@mui/material/Grid";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

// project imports
import UserActivityOverviewCard from "@/components/dashboard/Overview/UserActivityOverviewCard";
import OrganizarionOverviewCard from "@/components/dashboard/Overview/OrganizarionOverviewCard";
import TotalDataGeneratedCard from "@/components/dashboard/Overview/TotalDataGeneratedCard";
import ChannelActivityOverview from "@/components/dashboard/Overview/DeviceActivityOverview";
import TotalChannelCard from "@/components/dashboard/Overview/TotalChannelCard";
import TotalDevicesCard from "@/components/dashboard/Overview/TotalDevicesCard";
import { gridSpacing } from "@/app/store/constant";

// assets
import {
  Channel,
  DataPoint,
  Field,
  Device,
  Member,
  Organization,
} from "@/types";
import WelcomeContentCard from "./Overview/WelcomeContentCard";

// ==============================|| DEFAULT DASHBOARD ||============================== //

interface DashboardOverviewProps {
  organization: Organization | null;
  members: Member[] | null;
  devices: Device[] | null;
  channels: Channel[] | null;
  fields: Field[] | null;
  datapoints: DataPoint[] | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  organization,
  members,
  devices,
  channels,
  fields,
  datapoints,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRedirect = (href: string) => {
    setIsRedirecting(true);
    setLoading(true);
    router.push(href);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={8} md={12} sm={12} xs={12}>
            <WelcomeContentCard />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <div onClick={() => handleRedirect("/dashboard/organizations")}>
                  <OrganizarionOverviewCard
                    isLoading={isLoading || isRedirecting}
                    organization={organization}
                    members={members}
                  />
                </div>
              </Grid>

              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalDataGeneratedCard
                  {...{
                    isLoading: isLoading,
                    total: datapoints ? datapoints.length : 0,
                    label: "Total Datapoint Uploads",
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
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div onClick={() => handleRedirect("/dashboard/channels")}>
              <TotalChannelCard isLoading={isLoading} channels={channels} />
            </div>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div onClick={() => handleRedirect("/dashboard/devices")}>
              <TotalDevicesCard isLoading={isLoading} devices={devices} />
            </div>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <ChannelActivityOverview
              isLoading={isLoading}
              channels={channels}
              fields={fields}
              dataPoints={datapoints}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <UserActivityOverviewCard
              isLoading={isLoading}
              devices={devices}
              channels={channels}
              fields={fields}
              dataPoints={datapoints}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
