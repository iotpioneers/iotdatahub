"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  closestCenter,
  defaultDropAnimation,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { Widget } from "@/types/widgets";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";

interface DragDropProviderProps {
  children: React.ReactNode;
  onDrop: (widget: Widget) => void;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
  onDrop,
}) => {
  const [activeWidget, setActiveWidget] = useState<Widget | null>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
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
    useSensor(KeyboardSensor),
  );

  const handleScroll = useCallback((direction: "up" | "down") => {
    if (!scrollableRef.current) return;

    const scrollAmount = direction === "down" ? 50 : -50;
    scrollableRef.current.scrollBy({
      top: scrollAmount,
      behavior: "smooth",
    });
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const widget = event.active.data.current?.widget;
      if (widget) {
        setActiveWidget(widget);

        // Start checking for boundary proximity
        scrollInterval.current = setInterval(() => {
          if (!scrollableRef.current) return;

          const { top, bottom, height } =
            scrollableRef.current.getBoundingClientRect();
          const { y } = event.activatorEvent as MouseEvent;

          const threshold = 100;
          if (y < top + threshold) {
            handleScroll("up");
          } else if (y > bottom - threshold) {
            handleScroll("down");
          }
        }, 100);
      }
    },
    [handleScroll],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveWidget(null);
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }

      if (over && over.id === "dashboard-drop-area") {
        const widget = active.data.current?.widget;
        if (widget) {
          onDrop(widget);
        }
      }
    },
    [onDrop],
  );

  useEffect(() => {
    return () => {
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  const dropAnimation = {
    ...defaultDropAnimation,
    dragSourceOpacity: 0.5,
  };

  const modifiers = [restrictToParentElement, restrictToVerticalAxis];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      modifiers={modifiers}
    >
      <div ref={scrollableRef} className="h-full overflow-auto">
        {children}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeWidget ? (
          <div
            className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-2 opacity-90 transform rotate-2"
            style={{
              width: `${(activeWidget.position?.width || 2) * 50}px`,
              height: `${(activeWidget.position?.height || 3) * 50}px`,
            }}
          >
            <div className="font-bold text-sm text-blue-600">
              {activeWidget.definition?.label || "Widget"}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Drop on dashboard to add
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
