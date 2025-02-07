import { Suspense } from "react";
import DeviceListingComponent from "./_components/DeviceListingComponent";
import { Metadata } from "next";
import LoadingSpinner from "@/components/LoadingSpinner";

const DeviceListingsPage = async () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DeviceListingComponent />
    </Suspense>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Device List",
  description: "View all project devices",
};

export default DeviceListingsPage;
