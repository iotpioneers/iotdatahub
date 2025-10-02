import { Suspense } from "react";
import ChannelList from "./_components/ChannelList";
import type { Metadata } from "next";
import { TableSkeleton } from "@/components/ui/UnifiedLoading";

const ChannelsPage = () => {
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
      <ChannelList />
    </Suspense>
  );
};

export default ChannelsPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Channels - IoTDataHub - Dashboard",
  description:
    "View all project channels and devices data storage location and control options for each channel",
};
