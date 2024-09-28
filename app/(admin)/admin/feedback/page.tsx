import FeedbackManagementComponent from "@/components/Admin/components/FeedbackManagement/FeedbackManagementComponent";
import { Metadata } from "next";

const FeedbackManagement = () => {
  return <FeedbackManagementComponent />;
};

export default FeedbackManagement;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard - Feedback",
  description: "",
};
