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
  onWidgetDuplicate?: (widget: Widget) => void;
  deviceId: string;
}

const EditDeviceWidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  onWidgetDelete,
  onWidgetUpdate,
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
        w: widget.position?.width ?? 2,
        h: widget.position?.height ?? 3,
        minW: 1,
        minH: 2,
        maxW: 12,
        maxH: 6,
        static: false, // Allow movement
      })),
      md: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: widget.position?.width ?? 2,
        h: widget.position?.height ?? 3,
        minW: 1,
        minH: 2,
        maxW: 10,
        maxH: 6,
        static: false,
      })),
      sm: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: Math.min(widget.position?.width ?? 2, 6),
        h: widget.position?.height ?? 3,
        minW: 1,
        minH: 2,
        maxW: 6,
        maxH: 6,
        static: false,
      })),
      xs: widgets.map((widget) => ({
        i: widget.id,
        x: widget.position?.x ?? 0,
        y: widget.position?.y ?? 0,
        w: Math.min(widget.position?.width ?? 2, 4),
        h: widget.position?.height ?? 3,
        minW: 1,
        minH: 2,
        maxW: 4,
        maxH: 6,
        static: false,
      })),
      xxs: widgets.map((widget) => ({
        i: widget.id,
        x: 0, // Stack all widgets in single column for very small screens
        y: widget.position?.y ?? 0,
        w: 2,
        h: widget.position?.height ?? 3,
        minW: 2,
        minH: 2,
        maxW: 2,
        maxH: 6,
        static: false,
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

  // Memoized widget components to prevent unnecessary re-renders
  const renderWidgets = useMemo(() => {
    return widgets.map((widget) => (
      <div
        key={widget.id}
        className="widget-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-move"
        style={{ height: "100%", width: "100%" }}
      >
        <div className="widget-content h-full">
          <WidgetDisplay
            widget={widget}
            onDuplicate={() => handleDuplicate(widget)}
            onDelete={() => onWidgetDelete?.(widget.id)}
            className="h-full"
          />
        </div>
      </div>
    ));
  }, [widgets, handleDuplicate, onWidgetDelete]);

  return (
    <div className="min-h-screen overflow-y-auto">
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={50}
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
