import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import OrganizationOnboardingCreation from "@/components/Dashboard/OrganizationOnboardingCreation";
import { Metadata } from "next";

const Dashboard = async () => {
  return (
    <>
      <OrganizationOnboardingCreation />
      <DashboardOverview />
    </>
  );
};

export default Dashboard;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ten2Ten - Dashboard",
  description: "Explore our latest features",
};
