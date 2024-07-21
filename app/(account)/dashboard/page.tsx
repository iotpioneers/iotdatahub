"use client";

import { useEffect, useState } from "react";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import OrganizationOnboardingCreation from "@/components/Dashboard/OrganizationOnboardingCreation";

interface Organization {
  areaOfInterest: string;
  createdAt: Date;
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
  userId: string;
}

const Dashboard = () => {
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const checkOrganizationStatus = async () => {
      try {
        const response = await fetch("/api/organizations/status", {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Error fetching organization status");
          return;
        }

        const data = await response.json();
        setHasOrganization(data.hasOrganization);
        setOrganization(data.organization);
      } catch (error) {
        console.error("Error fetching organization status:", error);
      }
    };

    checkOrganizationStatus();
  }, []);

  if (hasOrganization === null) {
    return <div>Loading...</div>; // Show a loading state while checking the status
  }

  return (
    <>
      {!hasOrganization ? (
        <OrganizationOnboardingCreation />
      ) : (
        <DashboardOverview organization={organization} />
      )}
    </>
  );
};

export default Dashboard;

// export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "ARTISAN - Dashboard",
//   description: "Explore our latest features",
// };
