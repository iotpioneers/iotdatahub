"use client";

import React, { ReactNode, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCenter,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { Widget } from "@/types/widgets";
import { DragDropWidgetPreview } from "./DragDropWidgetPreview";

interface DragDropProviderProps {
  children: ReactNode;
  onDrop: (widget: Widget) => void;
  onWidgetAdded?: (widgetId: string) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onDrop,
  onWidgetAdded,
}) => {
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);
  const [isOverValidDropZone, setIsOverValidDropZone] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const widget = active.data.current?.widget as Widget;

    if (widget) {
      setActiveWidget(widget);
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;

    // Check if we're over a valid drop zone (not WidgetBox)
    const isValidDropZone =
      over &&
      over.id !== "widget-box" &&
      !over.id.toString().includes("widget-box");

    setIsOverValidDropZone(!!isValidDropZone);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const widget = active.data.current?.widget as Widget;

      setActiveWidget(null);
      setIsOverValidDropZone(false);

      if (!widget || !over) return;

      // Prevent dropping in WidgetBox
      if (
        over.id === "widget-box" ||
        over.id.toString().includes("widget-box")
      ) {
        return;
      }

      // Handle drop on valid drop zones
      onDrop(widget);

      if (onWidgetAdded) {
        onWidgetAdded(widget.id);
      }
    },
    [onDrop, onWidgetAdded],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay dropAnimation={null}>
        {activeWidget ? (
          <div className="transform-gpu">
            <DragDropWidgetPreview
              widget={activeWidget}
              isOverValidDropZone={isOverValidDropZone}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
