"use client";

import React, { useState, useCallback, useMemo } from "react";
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
  onWidgetUpdate?: (widget: Widget) => void;
  onWidgetDuplicate?: (widget: Widget) => void;
  deviceId: string;
}

const EditDeviceWidgetGrid: React.FC<WidgetGridProps> = React.memo(
  ({
    widgets,
    onWidgetMove,
    onWidgetDelete,
    onWidgetUpdate,
    onWidgetDuplicate,
    deviceId,
  }) => {
    const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

    // Memoize layout generation for performance
    const layout = useMemo(
      () => ({
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
      }),
      [widgets],
    );

    // Optimized layout change handler with debouncing
    const handleLayoutChange = useCallback(
      (currentLayout: any[]) => {
        // Use requestAnimationFrame to batch updates
        requestAnimationFrame(() => {
          currentLayout.forEach((item) => {
            const widget = widgets.find((w) => w.id === item.i);
            if (widget) {
              const newPosition = {
                x: item.x,
                y: item.y,
                width: item.w,
                height: item.h,
              };

              // Only update if position actually changed
              const currentPos = widget.position;
              const hasChanged =
                !currentPos ||
                currentPos.x !== newPosition.x ||
                currentPos.y !== newPosition.y ||
                currentPos.width !== newPosition.width ||
                currentPos.height !== newPosition.height;

              if (hasChanged) {
                onWidgetMove(widget, newPosition);
              }
            }
          });
        });
      },
      [widgets, onWidgetMove],
    );

    // Local duplication handler that doesn't hit the API immediately
    const handleDuplicate = useCallback(
      (widget: Widget) => {
        if (onWidgetDuplicate) {
          onWidgetDuplicate(widget);
        } else {
          // Fallback to API call if no local handler provided (backward compatibility)
          console.warn(
            "No local duplication handler provided, using API fallback",
          );
          handleApiDuplicate(widget);
        }
      },
      [onWidgetDuplicate],
    );

    // Legacy API duplication (kept for backward compatibility)
    const handleApiDuplicate = async (widget: Widget) => {
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

    // Widget settings handler
    const handleWidgetSettings = useCallback((widget: Widget) => {
      setSelectedWidget(widget);
    }, []);

    // Modal update handler
    const handleModalUpdate = useCallback(
      (updatedWidget: Widget) => {
        if (onWidgetUpdate) {
          onWidgetUpdate(updatedWidget);
        }
        setSelectedWidget(null);
      },
      [onWidgetUpdate],
    );

    // Memoized widget components to prevent unnecessary re-renders
    const widgetComponents = useMemo(() => {
      return widgets.map((widget) => (
        <div
          key={widget.id}
          className="widget-content"
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
            onSettings={() => handleWidgetSettings(widget)}
            onDelete={() => onWidgetDelete?.(widget.id)}
            className="widget-content"
          />
        </div>
      ));
    }, [widgets, handleDuplicate, handleWidgetSettings, onWidgetDelete]);

    return (
      <>
        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          onLayoutChange={handleLayoutChange}
          isDraggable
          isResizable
          isDroppable={false}
          draggableCancel=".widget-content, .action-button"
          draggableHandle=".drag-handle"
          resizeHandles={["se"]}
          useCSSTransforms
          compactType="vertical"
          preventCollision={false}
          autoSize={true}
        >
          {widgetComponents}
        </ResponsiveGridLayout>

        {selectedWidget && (
          <DeviceSettingModal
            widget={selectedWidget}
            onClose={() => setSelectedWidget(null)}
            onUpdate={handleModalUpdate}
          />
        )}
      </>
    );
  },
);

EditDeviceWidgetGrid.displayName = "EditDeviceWidgetGrid";

export default EditDeviceWidgetGrid;
