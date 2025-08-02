"use client";

import React, { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Widget } from "@/types/widgets";
import { LinearLoading } from "@/components/LinearLoading";
import EditDeviceDashboardComponent from "./EditDeviceDashboardComponent";
import { DroppableArea } from "@/components/Channels/dashboard/widgets/DroppableArea";
import DeviceHeader from "./DeviceHeader";
import useFetch from "@/hooks/useFetch";

// Types for handlers passed from parent
interface WidgetHandlers {
  onAdd: (widget: Widget) => void;
  onUpdate: (id: string, changes: Partial<Widget>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: Widget["position"]) => void;
}

interface Props {
  params: { id: string };
  widgets: Widget[];
  handlers: WidgetHandlers;
  isDirty: boolean;
}

const EditDeviceDashboard = React.memo<Props>(
  ({ params, widgets, handlers, isDirty }) => {
    const [selectedDuration, setSelectedDuration] = useState<string>("1mo");
    const { data: session, status } = useSession();

    // Fetch device data
    const { data: deviceData, isLoading: isDeviceLoading } = useFetch(
      `/api/devices/${params.id}`,
    );

    // Memoize handlers to prevent unnecessary re-renders
    const memoizedHandlers = useMemo(() => handlers, [handlers]);

    const handleDurationChange = (duration: string) => {
      setSelectedDuration(duration);
    };

    // Enhanced widget update handler that merges with existing widget data
    const handleWidgetUpdate = (updatedWidget: Widget) => {
      handlers.onUpdate(updatedWidget.id, updatedWidget);
    };

    // Widget position update handler
    const handleWidgetMove = (
      widget: Widget,
      newPosition: Widget["position"],
    ) => {
      handlers.onMove(widget.id, newPosition);
    };

    // Widget deletion handler with confirmation
    const handleWidgetDelete = (widgetId: string) => {
      const widget = widgets.find((w) => w.id === widgetId);
      const widgetName =
        widget?.settings?.title || widget?.definition?.label || "widget";

      const shouldDelete = window.confirm(
        `Are you sure you want to delete "${widgetName}"? This action cannot be undone until you save.`,
      );

      if (shouldDelete) {
        handlers.onDelete(widgetId);
      }
    };

    // Show loading states
    if (
      status === "loading" ||
      status === "unauthenticated" ||
      !session ||
      isDeviceLoading
    ) {
      return <LinearLoading />;
    }

    return (
      <div className="bg-white rounded-lg shadow-sm relative">
        {/* Dirty state indicator */}
        {isDirty && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-lg z-10">
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 animate-pulse" />
          </div>
        )}

        <DeviceHeader
          device={deviceData}
          selectedDuration={selectedDuration}
          onDurationChange={handleDurationChange}
        />

        <DroppableArea id="dashboard-drop-area">
          {!widgets || widgets.length === 0 ? (
            <div className="flex items-center justify-center h-[100vh] border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Add your first widget
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Double-click any widget from the widget box on the left, or
                  drag and drop it here to get started
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  {isDirty && (
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse" />
                      Unsaved changes
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Widget count and status indicator */}
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 shadow-sm border">
                  {widgets.length} widget{widgets.length !== 1 ? "s" : ""}
                  {isDirty && (
                    <span className="ml-2 inline-flex items-center text-orange-600">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1 animate-pulse" />
                      Modified
                    </span>
                  )}
                </div>
              </div>

              <EditDeviceDashboardComponent
                deviceId={params.id}
                widgets={widgets}
                onWidgetMove={handleWidgetMove}
                onWidgetDelete={handleWidgetDelete}
                onWidgetUpdate={handleWidgetUpdate}
              />
            </div>
          )}
        </DroppableArea>
      </div>
    );
  },
);

EditDeviceDashboard.displayName = "EditDeviceDashboard";

export default EditDeviceDashboard;
