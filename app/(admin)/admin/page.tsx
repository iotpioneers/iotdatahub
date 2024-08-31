import { Metadata } from "next";
import MainGrid from "@/components/Admin/components/MainGrid";

const AdminDashboardManagement = () => {
  return <MainGrid />;
};

export default AdminDashboardManagement;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard - Admin",
  description: "The admin dashboard of the IoTDataHub platform",
};
