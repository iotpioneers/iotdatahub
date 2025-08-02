"use client";

import React, { useRef, useState } from "react";
import WidgetBox, {
  generateDefaultPosition,
} from "@/components/Channels/dashboard/WidgetBox";
import EditDeviceDashboard from "./EditDeviceDashboard";
import { useRouter } from "next/navigation";
import DeviceSidebar from "./DeviceSidebar";
import DeviceHeaderComponent from "./DeviceHeaderComponent";
import { DragDropProvider } from "@/components/Channels/dashboard/widgets/DragDropProvider";
import { Widget } from "@/types/widgets";
import useAdd from "@/hooks/useAdd";

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const editDashboardRef = useRef<{
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
  } | null>(null);

  const { add } = useAdd(`/api/devices/${params.id}/widgets`);

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

  const handleDrop = async (widget: Widget) => {
    try {
      const result = await add({
        ...widget,
        position: generateDefaultPosition(),
      });
      if (result?.id) {
        // Widget added successfully
        console.log("Widget added successfully:", result);
      }
    } catch (error) {
      console.error("Failed to add widget:", error);
    }
  };

  return (
    <DragDropProvider onDrop={handleDrop}>
      <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl flex justify-between bg-slate-100 rounded-lg shadow p-2 overflow-hidden gap-1">
        <DeviceSidebar
          deviceId={params.id}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex flex-1 min-w-[200px] h-full rounded-md">
          <WidgetBox deviceId={params.id} />
        </div>
        <div className="grid gap-1 w-full rounded-md">
          <DeviceHeaderComponent
            deviceId={params.id}
            isLoading={isLoading}
            onSave={handleSaveAndApply}
            onCancel={handleCancel}
          />
          <EditDeviceDashboard params={params} ref={editDashboardRef} />
        </div>
      </div>
    </DragDropProvider>
  );
};

export default EditDashboardComponent;
