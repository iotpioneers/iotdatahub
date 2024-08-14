"use client";

import { useEffect, useState } from "react";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import OrganizationOnboardingCreation from "@/components/dashboard/OrganizationOnboardingCreation";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { useGlobalState } from "@/context";

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

const UserDashboardOverview = () => {
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loading, setLoading] = useState(true);

  const { setState } = useGlobalState();

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
      } catch (error) {
        return null;
      }
    };

    checkOrganizationStatus();
  }, []);

  if (hasOrganization === null) {
    return;
  }

  return (
    <>
      {loading && <LoadingProgressBar />}
      {!hasOrganization && <OrganizationOnboardingCreation />}
      <DashboardOverview organization={organization} members={members} />
    </>
  );
};

export default UserDashboardOverview;
