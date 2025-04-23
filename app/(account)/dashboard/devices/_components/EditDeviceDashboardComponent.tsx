"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Widget } from "@/types/widgets";
import EditDeviceWidgetGrid from "@/components/Channels/dashboard/widgets/EditDeviceWidgetGrid";

interface EditDeviceDashboardProps {
  deviceId: string;
  widgetData: Widget[];
}

const EditDeviceDashboardComponent = forwardRef<
  {
    saveChanges: () => Promise<void>;
    cancelChanges: () => void;
  },
  EditDeviceDashboardProps
>(({ deviceId, widgetData }, ref) => {
  const [widgets, setWidgets] = useState<Widget[]>(widgetData);
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: any;
  }>({});
  const [deletedWidgets, setDeletedWidgets] = useState<string[]>([]);

  useEffect(() => {
    setWidgets(widgetData);
  }, [widgetData]);

  const handleWidgetMove = (widget: Widget, newPosition: any) => {
    setPendingChanges((prev) => ({
      ...prev,
      [widget.id]: { ...newPosition },
    }));
  };

  const handleWidgetDelete = (widgetId: string) => {
    setDeletedWidgets((prev) => [...prev, widgetId]);
    setWidgets((prev) => prev.filter((w) => w.id !== widgetId));
  };

  useImperativeHandle(ref, () => ({
    async saveChanges() {
      try {
        const updatePromises = Object.entries(pendingChanges).map(
          ([widgetId, position]) =>
            fetch(`/api/devices/${deviceId}/widgets/${widgetId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ position }),
            }),
        );

        const deletePromises = deletedWidgets.map((widgetId) =>
          fetch(`/api/devices/${deviceId}/widgets/${widgetId}`, {
            method: "DELETE",
          }),
        );

        await Promise.all([...updatePromises, ...deletePromises]);

        setWidgets((prev) =>
          prev.map((widget) => ({
            ...widget,
            position: pendingChanges[widget.id] || widget.position,
          })),
        );

        setPendingChanges({});
        setDeletedWidgets([]);

        return Promise.resolve();
      } catch (error) {
        console.error("Error saving changes:", error);
        return Promise.reject(error);
      }
    },
    cancelChanges() {
      setWidgets(widgetData);
      setPendingChanges({});
      setDeletedWidgets([]);
    },
  }));

  return (
    <EditDeviceWidgetGrid
      widgets={widgets}
      onWidgetMove={handleWidgetMove}
      onWidgetDelete={handleWidgetDelete}
      deviceId={deviceId}
    />
  );
});

EditDeviceDashboardComponent.displayName = "EditDeviceDashboardComponent";

export default EditDeviceDashboardComponent;
