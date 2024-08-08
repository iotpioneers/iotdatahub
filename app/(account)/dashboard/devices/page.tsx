import { Suspense } from "react";
import DeviceTable from "./_components/DevicesTable";
import { Metadata } from "next";
import LoadingProgressBar from "@/components/LoadingProgressBar";

const DeviceListingsPage = async () => {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
      <DeviceTable />
    </Suspense>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Device List",
  description: "View all project devices",
};

export default DeviceListingsPage;
