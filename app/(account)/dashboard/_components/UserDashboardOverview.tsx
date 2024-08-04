"use client";

import { Suspense, useEffect, useState } from "react";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import OrganizationOnboardingCreation from "@/components/Dashboard/OrganizationOnboardingCreation";
import LoadingProgressBar from "@/components/LoadingProgressBar";

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

  useEffect(() => {
    const checkOrganizationStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/organizations/status", {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Error fetching organization status");
          return;
        }
        setLoading(false);

        const data = await response.json();
        setHasOrganization(data.hasOrganization);
        setOrganization(data.organization);
        setMembers(data.members);
      } catch (error) {
        console.error("Error fetching organization status:", error);
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
      <DashboardOverview organization={organization} members={members} />
      {!hasOrganization && <OrganizationOnboardingCreation />}
    </>
  );
};

export default UserDashboardOverview;
