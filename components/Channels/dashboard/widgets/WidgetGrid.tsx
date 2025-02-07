"use client";

import React, { useState, useEffect } from "react";
import { Widget, WidgetSettings } from "@/types/widgets";
import { Responsive, WidthProvider } from "react-grid-layout";
import { MoreHorizontal, Copy, Trash2 } from "lucide-react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { WidgetComponent } from "./WidgetComponent";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WidgetGridProps {
  widgets: Widget[];
  onWidgetMove: (widget: Widget, newPosition: Position) => void;
  onWidgetUpdate: (widget: Widget) => void;
  onWidgetDelete?: (widgetId: string) => void;
  deviceId: string;
}

export const WidgetGrid: React.FC<WidgetGridProps> = ({
  widgets,
  onWidgetMove,
  onWidgetUpdate,
  onWidgetDelete,
  deviceId,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    [key: string]: Position;
  }>({});
  const [originalLayouts, setOriginalLayouts] = useState<{
    [key: string]: Position;
  }>({});

  useEffect(() => {
    // Store initial widget positions
    const initial = widgets.reduce(
      (acc, widget) => {
        acc[widget.id] = {
          x: widget.position?.x ?? 0,
          y: widget.position?.y ?? 0,
          width: widget.position?.width ?? 4,
          height: widget.position?.height ?? 4,
        };
        return acc;
      },
      {} as { [key: string]: Position },
    );
    setOriginalLayouts(initial);
  }, [widgets]);

  const generateLayout = () => ({
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: pendingChanges[widget.id]?.x ?? widget.position?.x ?? 0,
      y: pendingChanges[widget.id]?.y ?? widget.position?.y ?? 0,
      w: pendingChanges[widget.id]?.width ?? widget.position?.width ?? 4,
      h: pendingChanges[widget.id]?.height ?? widget.position?.height ?? 4,
      minW: 2,
      minH: 2,
    })),
  });

  const handleLayoutChange = (currentLayout: any[]) => {
    const newChanges = { ...pendingChanges };
    currentLayout.forEach((item) => {
      const widget = widgets.find((w) => w.id === item.i);
      if (widget) {
        const newPosition: Position = {
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
        }
      }
    });
    setPendingChanges(newChanges);
  };

  const handleSaveAndApply = async () => {
    try {
      setIsSaving(true);
      const updatePromises = Object.entries(pendingChanges).map(
        ([widgetId, position]) => {
          return fetch(`/api/devices/${deviceId}/widgets/${widgetId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ position }),
          });
        },
      );

      await Promise.all(updatePromises);

      // Update all widgets with their new positions
      Object.entries(pendingChanges).forEach(([widgetId, position]) => {
        const widget = widgets.find((w) => w.id === widgetId);
        if (widget) {
          onWidgetMove(widget, position);
        }
      });

      // Clear pending changes
      setPendingChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingChanges({});
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
      onWidgetUpdate(newWidget);
    } catch (error) {
      console.error("Error duplicating widget:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen p-4">
      {/* Action Buttons */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
        {Object.keys(pendingChanges).length > 0 && (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save And Apply"}
            </button>
          </>
        )}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={generateLayout()}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        onLayoutChange={handleLayoutChange}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => setIsResizing(false)}
        isDraggable
        isResizable
        resizeHandles={["se", "sw", "ne", "nw", "e", "w", "s", "n"]}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="relative rounded-md shadow-md">
            <div className="absolute top-2 right-2 z-10">
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200">
                    <button
                      onClick={() => handleDuplicate(widget)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={() => onWidgetDelete?.(widget.id)}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <WidgetComponent
              widget={widget}
              onUpdate={onWidgetUpdate}
              onDelete={onWidgetDelete}
              isResizing={isResizing}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default WidgetGrid;
