import { Metadata } from "next";
import UserDashboardOverview from "./_components/UserDashboardOverview";

const Dashboard = () => {
  return <UserDashboardOverview />;
};

export default Dashboard;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard",
  description: "Explore our latest features",
};
