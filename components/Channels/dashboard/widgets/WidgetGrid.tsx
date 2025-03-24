"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import WidgetComponent from "./WidgetComponent";
import { LinearLoading } from "@/components/LinearLoading";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
  widgets: Widget[];
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({ widgets }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: Widget["position"];
  }>({});

  const generateLayout = () => ({
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: true,
    })),
  });

  const handleLayoutChange = (currentLayout: any[]) => {
    const newChanges = { ...pendingChanges };

    currentLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        const newPosition: Widget["position"] = {
          x: item.x,
          y: item.y,
          width:
            widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
          height:
            widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
        };

        if (
          widget.position?.x !== newPosition.x ||
          widget.position?.y !== newPosition.y
        ) {
          newChanges[widget.id] = newPosition;
        }
      }
    });
    setPendingChanges(newChanges);
  };

  const getWidgetStyle = (widget: Widget) => {
    const baseStyles =
      "rounded-lg overflow-hidden transition-shadow duration-200";
    const settings = widget.settings || {};

    return {
      className: `${baseStyles} widget-${widget.definition?.type}`,
      style: {
        backgroundColor: settings.backgroundColor || "white",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
      },
    };
  };

  const handleDuplicate = async (widget: Widget) => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/devices/${widget.deviceId}/widgets`, {
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
    } catch (error) {
      console.error("Error duplicating widget:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ResponsiveGridLayout
        className="layout"
        layouts={generateLayout()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        onLayoutChange={handleLayoutChange}
        isDraggable={false}
        isResizable={false}
        compactType="vertical"
      >
        {isSaving && <LinearLoading />}
        {widgets.map((widget) => {
          const widgetStyles = getWidgetStyle(widget);

          return (
            <div key={widget.id} {...widgetStyles}>
              {/* Widget Content */}
              <WidgetComponent widget={widget} />
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default WidgetGrid;
