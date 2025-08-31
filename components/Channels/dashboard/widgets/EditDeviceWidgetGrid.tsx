"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Widget } from "@/types/widgets";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetDisplay } from "./WidgetDisplay";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetMove: (widget: Widget, newPosition: Widget["position"]) => void;
  onWidgetDelete?: (widgetId: string) => void;
  onWidgetUpdate?: (widget: Widget) => void;
  onWidgetPartialUpdate?: (widgetId: string, changes: Partial<Widget>) => void; // **NEW**
  onWidgetDuplicate?: (widget: Widget) => void;
  deviceId: string;
}

const EditDeviceWidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  onWidgetDelete,
  onWidgetUpdate,
  onWidgetPartialUpdate, // **NEW**
  onWidgetDuplicate,
  deviceId,
}) => {
  // Memoize layout generation to prevent unnecessary recalculations
  const layout = useMemo(
    () => ({
      lg: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 3,
        h: widget.position?.height ?? 2,
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
        static: false, // Allow movement
      })),
      md: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 3,
        h: widget.position?.height ?? 2,
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
        static: false, // Allow movement
      })),
      sm: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 3,
        h: widget.position?.height ?? 2,
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
        static: false, // Allow movement
      })),
      xs: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 3,
        h: widget.position?.height ?? 2,
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
        static: false, // Allow movement
      })),
      xxs: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 3,
        h: widget.position?.height ?? 2,
        minW: 3,
        minH: 2,
        maxW: 12,
        maxH: 8,
        static: false, // Allow movement
      })),
    }),
    [widgets],
  );

  // Optimized layout change handler
  const handleLayoutChange = useCallback(
    (currentLayout: any[]) => {
      const layoutMap = new Map(currentLayout.map((item) => [item.i, item]));

      widgets.forEach((widget) => {
        const layoutItem = layoutMap.get(widget.id);
        if (layoutItem) {
          const newPosition = {
            x: layoutItem.x,
            y: layoutItem.y,
            width: layoutItem.w,
            height: layoutItem.h,
          };

          // Only update if position actually changed
          const currentPosition = widget.position;
          if (
            !currentPosition ||
            currentPosition.x !== newPosition.x ||
            currentPosition.y !== newPosition.y ||
            currentPosition.width !== newPosition.width ||
            currentPosition.height !== newPosition.height
          ) {
            onWidgetMove(widget, newPosition);
          }
        }
      });
    },
    [widgets, onWidgetMove],
  );

  // Local duplicate handler (for immediate UI feedback)
  const handleDuplicate = useCallback(
    (widget: Widget) => {
      if (onWidgetDuplicate) {
        onWidgetDuplicate(widget);
      }
    },
    [onWidgetDuplicate],
  );

  // **NEW**: Handler for partial widget updates (like pin config)
  const handleWidgetPartialUpdateCallback = useCallback(
    (widgetId: string) => (changes: Partial<Widget>) => {
      if (onWidgetPartialUpdate) {
        onWidgetPartialUpdate(widgetId, changes);
      }
    },
    [onWidgetPartialUpdate],
  );

  // Memoized widget components to prevent unnecessary re-renders
  const renderWidgets = useMemo(() => {
    return widgets.map((widget) => (
      <div
        key={widget.id}
        className="widgCet-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-move"
        style={{ height: "100%", width: "100%" }}
      >
        <div className="widget-content h-full">
          <WidgetDisplay
            widget={widget}
            onDuplicate={() => handleDuplicate(widget)}
            onDelete={() => onWidgetDelete?.(widget.id)}
            onUpdate={handleWidgetPartialUpdateCallback(widget.id)} // **NEW**: Pass the update handler
            className="h-full"
          />
        </div>
      </div>
    ));
  }, [
    widgets,
    handleDuplicate,
    onWidgetDelete,
    handleWidgetPartialUpdateCallback,
  ]);

  return (
    <div className="min-h-screen overflow-y-auto mb-16">
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
        rowHeight={30}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        isDroppable={false}
        draggableCancel=".action-button" // Only cancel on action buttons, allow dragging from anywhere else
        resizeHandles={["se"]}
        useCSSTransforms={true}
        measureBeforeMount={false}
        compactType={null} // CRITICAL: Disable auto-compacting to maintain positions
        preventCollision={true} // Prevent widgets from overlapping but don't auto-compact
        verticalCompact={false} // Disable vertical compacting
        autoSize={true} // Allow container to grow with content
        style={{ minHeight: "100vh" }} // Ensure minimum height for scrolling
      >
        {renderWidgets}
      </ResponsiveGridLayout>
    </div>
  );
};

export default React.memo(EditDeviceWidgetGrid);
