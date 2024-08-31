import { Metadata } from "next";
import PricingManagementDashboard from "@/components/Admin/components/PricingManagement/PricingManagementDashboard";

const AdminPricingManagement = () => {
  return <PricingManagementDashboard />;
};

export default AdminPricingManagement;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard - Pricing",
  description: "The pricing page of the IoTDataHub platform.",
};
