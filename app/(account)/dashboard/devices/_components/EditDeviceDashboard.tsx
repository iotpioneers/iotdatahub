"use client";

import React, { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { Widget } from "@/types/widgets";
import { LinearLoading } from "@/components/LinearLoading";
import EditDeviceDashboardComponent from "./EditDeviceDashboardComponent";
import { DroppableArea } from "@/components/Channels/dashboard/widgets/DroppableArea";
import DeviceHeader from "./DeviceHeader";

interface Props {
  params: { id: string };
  widgets: Widget[];
  onUpdate: (id: string, changes: Partial<Widget>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: Widget["position"]) => void;
  onDuplicate: (widget: Widget) => void;
  isDirty: boolean;
}

const EditDeviceDashboard: React.FC<Props> = ({
  params,
  widgets,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
  isDirty,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>("1mo");

  const { data: session, status } = useSession();
  const { data: deviceData, isLoading: isDeviceLoading } = useFetch(
    `/api/devices/${params.id}`,
  );

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    !session ||
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

      <DroppableArea id="dashboard-drop-area">
        {!widgets || widgets.length === 0 ? (
          <div className="flex items-center justify-center h-[100vh] border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800">
                Add new widget
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Double click the widget or drag it to the canvas
              </p>
              {isDirty && (
                <p className="mt-2 text-xs text-orange-600">
                  You have unsaved changes
                </p>
              )}
            </div>
          </div>
        ) : (
          <EditDeviceDashboardComponent
            deviceId={params.id}
            widgets={widgets}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onMove={onMove}
            onDuplicate={onDuplicate}
          />
        )}
      </DroppableArea>
    </div>
  );
};

export default EditDeviceDashboard;
