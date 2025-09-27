"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { Channel, DataPoint, Device, Field, Organization } from "@/types";
import type { EmployeeMember } from "@/types/employees-member";
import { CardSkeleton, ContentSkeleton } from "@/components/ui/UnifiedLoading";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

interface ApiResponse {
  hasOrganization: boolean;
  organization: Organization | null;
  members: EmployeeMember[];
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

  useEffect(() => {
    if (data && !data.hasOrganization) {
      router.push("/pricing");
    }
  }, [data, router]);

  if (error) return <div>Failed to load</div>;
  if (!data)
    return (
      <div className="p-6 space-y-6">
        <ContentSkeleton lines={2} className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );

  const { organization, members, devices, channels, fields, datapoints } = data;

  if (!organization) return null;

  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-6">
          <ContentSkeleton lines={2} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      }
    >
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
