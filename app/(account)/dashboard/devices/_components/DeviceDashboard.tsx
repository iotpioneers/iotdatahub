"use client";

import { useEffect, useState } from "react";
import { Widget } from "@/types/widgets";
import useUpdate from "@/hooks/useUpdate";
import WidgetGrid from "@/components/Channels/dashboard/widgets/WidgetGrid";

export default function DeviceDashboard({
  deviceId,
  widgetData,
}: {
  deviceId: string;
  widgetData: Widget[];
}) {
  const [widgets, setWidgets] = useState<Widget[]>(widgetData);
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: any;
  }>({});
  const [isSaving, setIsSaving] = useState(false);

  const { update } = useUpdate(`/api/devices/${deviceId}/widgets`);

  useEffect(() => {
    setWidgets(widgetData);
  }, [widgetData]);

  const handleWidgetMove = (widget: Widget, newPosition: any) => {
    setPendingChanges((prev) => ({
      ...prev,
      [widget.id]: newPosition,
    }));
  };

  const handleSaveAndApply = async () => {
    try {
      setIsSaving(true);
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

      await Promise.all(updatePromises);

      setWidgets((prev) =>
        prev.map((widget) => ({
          ...widget,
          position: pendingChanges[widget.id] || widget.position,
        })),
      );

      setPendingChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingChanges({});
  };

  return (
    <div className="relative min-h-screen">
      <WidgetGrid
        widgets={widgets}
        onWidgetMove={handleWidgetMove}
        onWidgetUpdate={(updatedWidget) =>
          setWidgets((prev) =>
            prev.map((widget) =>
              widget.id === updatedWidget.id ? updatedWidget : widget,
            ),
          )
        }
        onWidgetDelete={(widgetId) =>
          setWidgets((prev) => prev.filter((widget) => widget.id !== widgetId))
        }
        deviceId={deviceId}
      />

      {Object.keys(pendingChanges).length > 0 && (
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndApply}
            className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save And Apply"}
          </button>
        </div>
      )}
    </div>
  );
}
