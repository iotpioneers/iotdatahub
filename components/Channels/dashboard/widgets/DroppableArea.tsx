"use client";

import React, { useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Widget } from "@/types/widgets";
import useAdd from "@/hooks/useAdd";
import { cn } from "@/lib/utils";

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
  onWidgetAdded?: (widget: Widget) => void;
}

export const DroppableArea = ({
  id,
  children,
  onWidgetAdded,
}: DroppableAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const { add } = useAdd(`/api/devices/${id}/widgets`);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      try {
        const widgetData = e.dataTransfer.getData("application/json");
        if (!widgetData) return;

        const widget = JSON.parse(widgetData) as Widget;
        const result = await add(widget);

        if (result && onWidgetAdded) {
          onWidgetAdded(result);
        }
      } catch (error) {
        console.error("Error handling drop:", error);
      }
    },
    [add, onWidgetAdded],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  return (
    <div
      ref={setNodeRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={cn(
        "min-h-[400px] w-full transition-colors duration-200",
        isOver
          ? "bg-blue-50 border-2 border-blue-300"
          : "bg-white border border-gray-200",
      )}
    >
      {children}
    </div>
  );
};
