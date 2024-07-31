import { Metadata } from "next";
import UserDashboardOverview from "./_components/UserDashboardOverview";
import { Suspense } from "react";
import LoadingProgressBar from "@/components/LoadingProgressBar";

const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
      <UserDashboardOverview />
    </Suspense>
  );
};

export default Dashboard;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard",
  description: "Explore our latest features",
};
