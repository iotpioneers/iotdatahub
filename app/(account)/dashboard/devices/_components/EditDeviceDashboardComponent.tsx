"use client";

import React, { useMemo } from "react";
import { Widget } from "@/types/widgets";
import EditDeviceWidgetGrid from "@/components/Channels/dashboard/widgets/EditDeviceWidgetGrid";

interface EditDeviceDashboardProps {
  deviceId: string;
  widgets: Widget[];
  onUpdate: (id: string, changes: Partial<Widget>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: Widget["position"]) => void;
  onDuplicate: (widget: Widget) => void;
}

const EditDeviceDashboardComponent: React.FC<EditDeviceDashboardProps> = ({
  deviceId,
  widgets,
  onUpdate,
  onDelete,
  onMove,
  onDuplicate,
}) => {
  // Memoize widget handlers to prevent unnecessary re-renders
  const handleWidgetMove = useMemo(
    () => (widget: Widget, newPosition: Widget["position"]) => {
      onMove(widget.id, newPosition);
    },
    [onMove],
  );

  const handleWidgetDelete = useMemo(
    () => (widgetId: string) => {
      onDelete(widgetId);
    },
    [onDelete],
  );

  const handleWidgetUpdate = useMemo(
    () => (widget: Widget) => {
      onUpdate(widget.id, widget);
    },
    [onUpdate],
  );

  const handleWidgetDuplicate = useMemo(
    () => (widget: Widget) => {
      onDuplicate(widget);
    },
    [onDuplicate],
  );

  // Memoize widgets to prevent unnecessary re-renders
  const memoizedWidgets = useMemo(() => widgets, [widgets]);

  return (
    <EditDeviceWidgetGrid
      widgets={memoizedWidgets}
      onWidgetMove={handleWidgetMove}
      onWidgetDelete={handleWidgetDelete}
      onWidgetUpdate={handleWidgetUpdate}
      onWidgetDuplicate={handleWidgetDuplicate}
      deviceId={deviceId}
    />
  );
};

export default React.memo(EditDeviceDashboardComponent);
