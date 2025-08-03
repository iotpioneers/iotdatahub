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

const EditDeviceWidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  onWidgetDelete,
  onWidgetUpdate,
  onWidgetDuplicate,
  deviceId,
}) => {
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

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
          onSettings={() => setSelectedWidget(widget)}
          onDelete={() => onWidgetDelete?.(widget.id)}
          className="widget-content"
        />
      </div>
    ));
  }, [widgets, handleDuplicate, onWidgetDelete]);

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
        measureBeforeMount={false}
        compactType="vertical"
        preventCollision={false}
      >
        {renderWidgets}
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

export default React.memo(EditDeviceWidgetGrid);
