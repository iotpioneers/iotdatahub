"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { Widget } from "@/types/widgets";
import { LinearLoading } from "@/components/LinearLoading";
import EditDeviceDashboardComponent from "./EditDeviceDashboardComponent";
import { DroppableArea } from "@/components/Channels/dashboard/widgets/DroppableArea";
import DeviceHeader from "./DeviceHeader";

interface Props {
  params: { id: string };
}

const EditDeviceDashboard = forwardRef<
  {
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
  },
  Props
>(({ params }, ref) => {
  const [selectedDuration, setSelectedDuration] = useState<string>("1mo");
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: any;
  }>({});
  const [deletedWidgets, setDeletedWidgets] = useState<string[]>([]);
  const deviceDashboardRef = React.useRef<{
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
  } | null>(null);

  const { data: session, status } = useSession();
  const { data: widgetData, isLoading } = useFetch(
    `/api/devices/${params.id}/widgets`,
  );

  const { data: deviceData, isLoading: isDeviceLoading } = useFetch(
    `/api/devices/${params.id}`,
  );

  useEffect(() => {
    if (widgetData) {
      setWidgets(widgetData);
    }
  }, [widgetData]);

  useImperativeHandle(ref, () => ({
    async saveChanges() {
      if (deviceDashboardRef.current) {
        await deviceDashboardRef.current.saveChanges();
      }
    },
    cancelChanges() {
      if (deviceDashboardRef.current) {
        deviceDashboardRef.current.cancelChanges();
      }
    },
  }));

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    !session ||
    isLoading ||
    isDeviceLoading
  ) {
    return <LinearLoading />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DeviceHeader
        device={deviceData}
        selectedDuration={selectedDuration}
        onDurationChange={handleDurationChange}
      />

      <DroppableArea id={params.id}>
        <div className="overflow-auto max-h-[80vh]">
          {!widgets || widgets.length === 0 ? (
            <div className="flex items-center justify-center h-[100vh] border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800">
                  Add new widget
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Double click the widget or drag it to the canvas
                </p>
              </div>
            </div>
          ) : (
            <EditDeviceDashboardComponent
              deviceId={params.id}
              widgetData={widgets}
              ref={deviceDashboardRef}
            />
          )}
        </div>
      </DroppableArea>
    </div>
  );
});

EditDeviceDashboard.displayName = "EditDeviceDashboard";

export default EditDeviceDashboard;
