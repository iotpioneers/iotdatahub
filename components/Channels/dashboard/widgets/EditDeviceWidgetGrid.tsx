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
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const generateLayout = () => ({
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: widget.position?.x ?? 0,
      y: widget.position?.y ?? 0,
      w: widget.position?.width ?? 2,
      h: widget.position?.height ?? 3,
      minW: 1,
      minH: 2,
      maxW: 12,
      maxH: 6,
    })),
  });

  const handleLayoutChange = (currentLayout: any[]) => {
    currentLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        onWidgetMove(widget, {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
        });
      }
    });
  };

  const handleDuplicate = async (widget: Widget) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/widgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...widget,
          id: `widget-${widget.definition?.type}-${Date.now()}`,
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
    }
  };

  return (
    <>
      <ResponsiveGridLayout
        className="layout"
        layouts={generateLayout()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
        isDroppable
        resizeHandles={["se"]}
        draggableCancel=".no-drag" // Add class to elements that shouldn't trigger drag
        preventCollision
        useCSSTransforms
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="bg-transparent shadow rounded-md"
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
              onSettings={() => setSelectedWidget(widget)}
              onDelete={() => onWidgetDelete?.(widget.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      {selectedWidget && (
        <DeviceSettingModal
          widget={selectedWidget}
          onClose={() => setSelectedWidget(null)}
          onUpdate={(updatedWidget) => {
            if (onWidgetUpdate) {
              onWidgetUpdate(updatedWidget);
            }
            setSelectedWidget(null);
          }}
        />
      )}
    </>
  );
};

export default EditDeviceWidgetGrid;
