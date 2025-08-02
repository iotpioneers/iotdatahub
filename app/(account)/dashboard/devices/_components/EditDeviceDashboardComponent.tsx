"use client";

import React, { useMemo, useCallback } from "react";
import { Widget } from "@/types/widgets";
import EditDeviceWidgetGrid from "@/components/Channels/dashboard/widgets/EditDeviceWidgetGrid";

interface EditDeviceDashboardProps {
  deviceId: string;
  widgets: Widget[];
  onWidgetMove: (widget: Widget, newPosition: Widget["position"]) => void;
  onWidgetDelete: (widgetId: string) => void;
  onWidgetUpdate: (widget: Widget) => void;
}

const EditDeviceDashboardComponent = React.memo<EditDeviceDashboardProps>(
  ({ deviceId, widgets, onWidgetMove, onWidgetDelete, onWidgetUpdate }) => {
    // Memoize widget list to prevent unnecessary re-renders
    const memoizedWidgets = useMemo(() => widgets, [widgets]);

    // Memoized handlers to prevent child re-renders
    const handleWidgetMove = useCallback(
      (widget: Widget, newPosition: Widget["position"]) => {
        // Only call if position actually changed
        const currentPosition = widget.position;
        const hasChanged =
          !currentPosition ||
          currentPosition.x !== newPosition?.x ||
          currentPosition.y !== newPosition?.y ||
          currentPosition.width !== newPosition?.width ||
          currentPosition.height !== newPosition?.height;

        if (hasChanged) {
          onWidgetMove(widget, newPosition);
        }
      },
      [onWidgetMove],
    );

    const handleWidgetDelete = useCallback(
      (widgetId: string) => {
        onWidgetDelete(widgetId);
      },
      [onWidgetDelete],
    );

    const handleWidgetUpdate = useCallback(
      (widget: Widget) => {
        onWidgetUpdate(widget);
      },
      [onWidgetUpdate],
    );

    // Duplicate widget handler with local state management
    const handleWidgetDuplicate = useCallback(
      async (widget: Widget) => {
        try {
          // Create a new widget based on the existing one
          const duplicatedWidget: Widget = {
            ...widget,
            id: `${widget.definition?.type}-${Date.now()}`,
            settings: {
              ...widget.settings,
              title: `${widget.settings?.title || widget.definition?.label || "Widget"} (Copy)`,
            },
            position: {
              x: (widget.position?.x || 0) + 1,
              y: (widget.position?.y || 0) + 1,
              width: widget.position?.width || 2,
              height: widget.position?.height || 3,
            },
          };

          // Instead of directly calling API, use the update handler to add to local state
          // This will be saved when the user clicks save
          onWidgetUpdate(duplicatedWidget);
        } catch (error) {
          console.error("Error duplicating widget:", error);
          // You might want to show a toast notification here
        }
      },
      [onWidgetUpdate],
    );

    // Performance optimization: Only render if widgets actually changed
    const widgetCount = widgets.length;
    const widgetIds = useMemo(
      () =>
        widgets
          .map((w) => w.id)
          .sort()
          .join(","),
      [widgets],
    );

    return (
      <div className="relative">
        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute top-0 left-0 z-50 bg-black/75 text-white text-xs p-1 rounded">
            Widgets: {widgetCount} | IDs: {widgetIds.slice(0, 20)}...
          </div>
        )}

        <EditDeviceWidgetGrid
          widgets={memoizedWidgets}
          onWidgetMove={handleWidgetMove}
          onWidgetDelete={handleWidgetDelete}
          onWidgetUpdate={handleWidgetUpdate}
          onWidgetDuplicate={handleWidgetDuplicate}
          deviceId={deviceId}
        />
      </div>
    );
  },
);

EditDeviceDashboardComponent.displayName = "EditDeviceDashboardComponent";

export default EditDeviceDashboardComponent;
