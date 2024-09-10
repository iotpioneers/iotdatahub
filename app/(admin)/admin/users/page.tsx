import UserManagementDashboard from "@/components/Admin/components/UserManagement/UserManagementDashboard";
import { Metadata } from "next";

const UserManagementPage = () => {
  return <UserManagementDashboard />;
};

export default UserManagementPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard - Users",
  description: "IoTDataHub - Admin - Users",
};
