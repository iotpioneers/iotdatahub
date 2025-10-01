import React from "react";
import { Metadata } from "next";
import DeveloperResources from "@/components/Home/components/developer-resources/DeveloperResources";

const DeveloperResourcesPage = () => {
  return <DeveloperResources />;
};

export default DeveloperResourcesPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Developer Resources",
  description:
    "Explore our developer resources including API docs, SDKs, and guides.",
};
