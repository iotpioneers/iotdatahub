import React, { Suspense } from "react";
import DeviceList from "./_components/DeviceLists";
import { Metadata } from "next";
import LoadingSpinner from "@/components/LoadingSpinner";

const Devices = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DeviceList />;
    </Suspense>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ten2Ten - Device List",
  description: "View all project devices",
};

export default Devices;
