"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import {
  Channel,
  DataPoint,
  Device,
  Field,
  Member,
  Organization,
} from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ApiResponse {
  hasOrganization: boolean;
  organization: Organization | null;
  members: Member[];
  devices: Device[];
  channels: Channel[];
  fields: Field[];
  datapoints: DataPoint[];
}

const fetcher = async (url: string): Promise<ApiResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return response.json();
};

const UserDashboardOverview = () => {
  const router = useRouter();
  const { data, error } = useSWR<ApiResponse, Error>(
    "/api/organizations/status",
    fetcher,
    { refreshInterval: 5000 }
  );
  const router = useRouter();
  const { data, error } = useSWR<ApiResponse, Error>(
    "/api/organizations/status",
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    if (data && !data.hasOrganization) {
      router.push("/feature-creation");
    }
  }, [data, router]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <LoadingProgressBar />;

  const { organization, members, devices, channels, fields, datapoints } = data;
    if (data && !data.hasOrganization) {
      router.push("/feature-creation");
    }
  }, [data, router]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <LoadingProgressBar />;

  const { organization, members, devices, channels, fields, datapoints } = data;

  if (!organization) return null;
  if (!organization) return null;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardOverview
        organization={organization}
        members={members}
        devices={devices}
        channels={channels}
        fields={fields}
        datapoints={datapoints}
      />
    </Suspense>
  );
};

export default UserDashboardOverview;
