"use client";

import React, { useRef, useState, useEffect } from "react";
import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import EditDeviceDashboard from "./EditDeviceDashboard";
import { useRouter } from "next/navigation";
import DeviceSidebar from "./DeviceSidebar";
import DeviceHeaderComponent from "./DeviceHeaderComponent";

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const editDashboardRef = useRef<{
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
  } | null>(null);

  const handleSaveAndApply = async () => {
    setIsLoading(true);
    try {
      if (editDashboardRef.current) {
        await editDashboardRef.current.saveChanges();
      }
      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      console.error("Error saving dashboard changes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsLoading(true);
    try {
      if (editDashboardRef.current) {
        editDashboardRef.current.cancelChanges();
      }
      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      console.error("Error canceling dashboard changes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl flex justify-between bg-slate-100 rounded-lg shadow p-1 overflow-hidden">
      <DeviceSidebar
        deviceId={params.id}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 lg:min-w-[700px] ml-1 md:ml-2 rounded-md">
        <div className="grid gap-1">
          <DeviceHeaderComponent
            deviceId={params.id}
            isLoading={isLoading}
            onSave={handleSaveAndApply}
            onCancel={handleCancel}
          />
          <EditDeviceDashboard params={params} ref={editDashboardRef} />
        </div>
      </div>
      <div className="flex ml-1 md:ml-2 flex-1 rounded-md">
        <WidgetBox deviceId={params.id} />
      </div>
    </div>
  );
};

export default EditDashboardComponent;
