import { Suspense } from "react";
import DeviceListingComponent from "./_components/DeviceListingComponent";
import { Metadata } from "next";
import { TableSkeleton } from "@/components/ui/unified-loading";

const DeviceListingsPage = async () => {
  return (
    <Suspense
      fallback={
        <div className="w-full pt-5">
          <div className="mb-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-2" />
          </div>
          <TableSkeleton rows={6} columns={5} />
        </div>
      }
    >
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
