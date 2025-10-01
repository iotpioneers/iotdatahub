"use client";

import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";

import { DeviceSummary } from "@/components/dashboard/Overview/DeviceSummary";
import { LatestAlert } from "@/components/dashboard/Overview/LatestAlert";
import { LatestProducts } from "@/components/dashboard/Overview/latest-products";
import { EnterpriseMetricsComponent } from "@/components/dashboard/Overview/EnterpriseMetricsComponent";
import { SubscriptionUsage } from "@/components/dashboard/Overview/SubscriptionUsage";
import { TotalUsers } from "@/components/dashboard/Overview/TotalUsers";
import { EnterpriseMetrics } from "@/components/dashboard/Overview/EnterpriseMetrics";
import { Traffic } from "@/components/dashboard/Overview/traffic";
import { useSession } from "next-auth/react";
import { Organization } from "@/types/uni-types";
import { LinearLoading } from "@/components/LinearLoading";

const DeviceOrganization = (): React.JSX.Element => {
  const [organization, setOrganization] = React.useState<Organization | null>(
    null
  );
  const [loading, setLoading] = React.useState<Boolean>(true); // Start with loading true
  const [error, setError] = React.useState<string | null>(null);

  const { data } = useSession();
  const organizationId = data?.user.organizationId;

  React.useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/organizations/${organizationId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch organization");
        }

        const data: Organization = await response.json();
        setOrganization(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load organization data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  // Show loading state
  if (loading || error || !organization) {
    return <LinearLoading />;
  }

  // Use organization data
  const devices = organization.Device || [];
  const members = organization.users || [];

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <DeviceSummary
          diff={12}
          trend="up"
          sx={{ height: "100%" }}
          devices={devices}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalUsers
          diff={16}
          trend="down"
          sx={{ height: "100%" }}
          members={members}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <SubscriptionUsage sx={{ height: "100%" }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <EnterpriseMetrics sx={{ height: "100%" }} value="15k" />
      </Grid>
      <Grid lg={8} xs={12}>
        <EnterpriseMetricsComponent
          chartSeries={[
            {
              name: "This year",
              data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20],
            },
            {
              name: "Last year",
              data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13],
            },
          ]}
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic
          chartSeries={[63, 15, 22]}
          labels={["Desktop", "Tablet", "Phone"]}
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: "PRD-005",
              name: "Channel Configuration",
              image: "/assets/product-5.png",
              updatedAt: dayjs()
                .subtract(18, "minutes")
                .subtract(5, "hour")
                .toDate(),
            },
            {
              id: "PRD-004",
              name: "Device Firmware",
              image: "/assets/product-4.png",
              updatedAt: dayjs()
                .subtract(41, "minutes")
                .subtract(3, "hour")
                .toDate(),
            },
            {
              id: "PRD-003",
              name: "API Integration",
              image: "/assets/product-3.png",
              updatedAt: dayjs()
                .subtract(5, "minutes")
                .subtract(3, "hour")
                .toDate(),
            },
            {
              id: "PRD-002",
              name: "New Workspace",
              image: "/assets/product-2.png",
              updatedAt: dayjs()
                .subtract(23, "minutes")
                .subtract(2, "hour")
                .toDate(),
            },
            {
              id: "PRD-001",
              name: "Notification Rules",
              image: "/assets/product-1.png",
              updatedAt: dayjs().subtract(10, "minutes").toDate(),
            },
          ]}
          sx={{ height: "100%" }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestAlert
          alerts={[
            {
              id: "ALRT-007",
              alert: { name: "Temp Sensor #34" },
              amount: 30.5,
              status: "investigating",
              createdAt: dayjs().subtract(10, "minutes").toDate(),
            },
            {
              id: "ALRT-006",
              alert: { name: "Humidity Monitor #12" },
              amount: 25.1,
              status: "resolved",
              createdAt: dayjs().subtract(10, "minutes").toDate(),
            },
            {
              id: "ALRT-004",
              alert: { name: "API Key Expiry Reminder" },
              amount: 10.99,
              status: "critical",
              createdAt: dayjs().subtract(10, "minutes").toDate(),
            },
            {
              id: "ALRT-003",
              alert: { name: "New Device Added" },
              amount: 96.43,
              status: "investigating",
              createdAt: dayjs().subtract(10, "minutes").toDate(),
            },
            {
              id: "ALRT-002",
              alert: { name: "Channel Downtime" },
              amount: 32.54,
              status: "resolved",
              createdAt: dayjs().subtract(10, "minutes").toDate(),
            },
          ]}
          sx={{ height: "100%" }}
        />
      </Grid>
    </Grid>
  );
};
export default DeviceOrganization;
