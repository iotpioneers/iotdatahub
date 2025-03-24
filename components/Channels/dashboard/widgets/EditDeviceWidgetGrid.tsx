"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetDisplay } from "./WidgetDisplay";
import DeviceSettingModal from "./DeviceSettingModal";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetMove: (widget: Widget, newPosition: Widget["position"]) => void;
  onWidgetDelete?: (widgetId: string) => void;
  deviceId: string;
  onWidgetUpdate?: (widget: Widget) => void;
}

const EditDeviceWidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  onWidgetDelete,
  deviceId,
  onWidgetUpdate,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const generateLayout = () => ({
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: widget.position?.x ?? 0,
      y: widget.position?.y ?? 0,
      w: widget.position?.width ?? 2, // Reduced default width
      h: widget.position?.height ?? 2, // Reduced default height
      minW: 1, // Allow width down to 1 column
      minH: 1, // Allow height down to 1 row
      maxW: 12, // Maximum width
      maxH: 6, // Maximum height
    })),
  });

  const handleLayoutChange = (currentLayout: any[]) => {
    const changes = currentLayout.reduce((acc, item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        acc[widget.id] = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
        };
      }
      return acc;
    }, {});

    Object.entries(changes).forEach(([widgetId, newPosition]) => {
      const widget = widgets.find((w) => w.id === widgetId);
      if (widget) {
        onWidgetMove(widget, newPosition as Widget["position"]);
      }
    });
  };

  const handleDuplicate = async (widget: Widget) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/devices/${deviceId}/widgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...widget,
          position: {
            ...widget.position,
            x: (widget.position?.x || 0) + 1,
            y: (widget.position?.y || 0) + 1,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to duplicate widget");
      const newWidget = await response.json();
      if (onWidgetUpdate) {
        onWidgetUpdate(newWidget);
      }
    } catch (error) {
      console.error("Error duplicating widget:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsClick = (widget: Widget) => {
    setSelectedWidget(widget);
  };

  const handleCloseSettings = () => {
    setSelectedWidget(null);
  };

  return (
    <div className="bg-gray-100 relative min-h-screen overflow-y-auto">
      <ResponsiveGridLayout
        className="layout"
        layouts={generateLayout()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        onLayoutChange={handleLayoutChange}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
        isDraggable
        isResizable
        isDroppable
        resizeHandles={["se"]}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            data-grid={{
              x: widget.position?.x || 0,
              y: widget.position?.y || 0,
              w: widget.position?.width || 2,
              h: widget.position?.height || 2,
              minW: 1,
              minH: 1,
            }}
          >
            <WidgetDisplay
              widget={widget}
              onDuplicate={() => handleDuplicate(widget)}
              onSettings={() => handleSettingsClick(widget)}
              onDelete={() => onWidgetDelete?.(widget.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      {selectedWidget && (
        <DeviceSettingModal
          widget={selectedWidget}
          onClose={handleCloseSettings}
          onUpdate={onWidgetUpdate ?? (() => {})}
        />
      )}
    </div>
  );
};

export default EditDeviceWidgetGrid;
