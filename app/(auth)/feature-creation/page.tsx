import React from "react";
import { Metadata } from "next";
import { OrganizationOnboardingCreation } from "@/components/dashboard";

const OrganizationFeatureCreation = () => {
  return <OrganizationOnboardingCreation />;
};

export default OrganizationFeatureCreation;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Feature Creation",
  description: "Create a new feature",
};
