"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
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
import { DashboardOverview } from "@/components/dashboard";
import { useSession } from "next-auth/react";
import SubscriptionModal from "@/components/dashboard/Checkout/SubscriptionModal";

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
  const { data: session } = useSession();
  const { data, error } = useSWR<ApiResponse, Error>(
    "/api/organizations/status",
    fetcher,
    { refreshInterval: 5000 },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (data && !data.hasOrganization) {
      router.push("/feature-creation");
    }
  }, [data, router]);

  useEffect(() => {
    if (
      session?.user &&
      (session.user.subscriptionId === null || !session?.user.subscriptionId)
    ) {
      setIsModalOpen(true);
    }
  }, [session]);

  if (error) return <div>Failed to load</div>;
  if (!data) return <LoadingProgressBar />;

  const { organization, members, devices, channels, fields, datapoints } = data;

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
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Suspense>
  );
};

export default UserDashboardOverview;
