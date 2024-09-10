"use client";

import { useEffect, useState } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import OrganizationOnboardingCreation from "@/components/dashboard/OrganizationOnboardingCreation";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import {
  Channel,
  DataPoint,
  Device,
  Field,
  Member,
  Organization,
} from "@/types";

const UserDashboardOverview = () => {
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [fields, setFields] = useState<Field[] | null>(null);
  const [dataPoints, setDataPoints] = useState<DataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOrganizationStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/organizations/status", {
          method: "GET",
        });

        if (!response.ok) {
          return;
        }
        setLoading(false);

        const data = await response.json();
        setHasOrganization(data.hasOrganization);
        setOrganization(data.organization);
        setMembers(data.members);
        setDevices(data.devices);
        setChannels(data.channels);
        setFields(data.fields);
        setDataPoints(data.datapoints);
      } catch (error) {
        return null;
      }
    };

    checkOrganizationStatus();
  }, [
    channels?.length,
    devices?.length,
    fields?.length,
    dataPoints?.length,
    members?.length,
  ]);

  if (hasOrganization === null) {
    return;
  }

  return (
    <>
      {loading && <LoadingProgressBar />}
      {!hasOrganization && <OrganizationOnboardingCreation />}
      {!loading &&
        organization &&
        members &&
        devices &&
        channels &&
        fields &&
        dataPoints && (
          <DashboardOverview
            organization={organization}
            members={members}
            devices={devices}
            channels={channels}
            fields={fields}
            datapoints={dataPoints}
          />
        )}
    </>
  );
};

export default UserDashboardOverview;
