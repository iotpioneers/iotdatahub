"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import WidgetComponent from "./WidgetComponent";
import { useToast } from "@/hooks/useToast";
import LoadingOverlay from "./LoadingOverlay";
import { useRouter } from "next/navigation";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetUpdate: (widget: Widget) => Promise<void>;
  onWidgetDelete: (widgetId: string) => Promise<void>;
  onWidgetDuplicate: (widget: Widget) => Promise<void>;
  deviceId: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetUpdate,
  onWidgetDelete,
  onWidgetDuplicate,
  deviceId,
}) => {
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: Widget["position"];
  }>({});
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const generateLayout = () => ({
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: false,
    })),
    md: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: false,
    })),
    sm: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: false,
    })),
    xs: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: false,
    })),
    xxs: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: widget.position?.width ?? widget.definition?.defaultSize?.w ?? 4,
      h: widget.position?.height ?? widget.definition?.defaultSize?.h ?? 4,
      static: false,
    })),
  });

  const handleLayoutChange = async (currentLayout: any[], allLayouts: any) => {
    const newChanges = { ...pendingChanges };

    for (const item of currentLayout) {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        const newPosition: Widget["position"] = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
        };

        if (
          widget.position?.x !== newPosition.x ||
          widget.position?.y !== newPosition.y ||
          widget.position?.width !== newPosition.width ||
          widget.position?.height !== newPosition.height
        ) {
          newChanges[widget.id] = newPosition;

          try {
            setIsSaving(true);
            await onWidgetUpdate({
              ...widget,
              position: newPosition,
            });
            delete newChanges[widget.id];
          } catch (error) {
            showToast("Failed to save widget position", "error");
          } finally {
            setIsSaving(false);
          }
        }
      }
    }

    setPendingChanges(newChanges);
  };

  const handleValueChange = async (widgetId: string, value: any) => {
    const widget = widgets.find((w) => w.id === widgetId);
    if (widget) {
      await onWidgetUpdate({
        ...widget,
        settings: {
          ...widget.settings,
          value,
        },
      });
    }
  };

  const handleConfigClick = (widgetId: string) => {
    router.push(`/dashboard/devices/${deviceId}/widgets/${widgetId}/config`);
  };

  const getWidgetStyle = (widget: Widget) => {
    const baseStyles = "rounded-lg overflow-hidden transition-all duration-200";
    const settings = widget.settings || {};

    return {
      className: `${baseStyles} widget-${widget.definition?.type}`,
      style: {
        backgroundColor: settings.backgroundColor || "white",
        border: `1px solid ${settings.color ? `${settings.color}30` : "rgba(0, 0, 0, 0.1)"}`,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column" as const,
        position: "relative" as const,
      },
    };
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
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        draggableCancel=".widget-content"
      >
        {widgets.map((widget) => {
          const widgetStyles = getWidgetStyle(widget);

          return (
            <div key={widget.id} {...widgetStyles}>
              <WidgetComponent
                widget={widget}
                onEdit={() => handleConfigClick(widget.id)}
                onDelete={onWidgetDelete}
                onDuplicate={onWidgetDuplicate}
                onConfig={() => handleConfigClick(widget.id)}
                onValueChange={handleValueChange}
              />
            </div>
          );
        })}
      </ResponsiveGridLayout>

      <LoadingOverlay isLoading={isSaving} />
    </div>
  );
};

export default WidgetGrid;
