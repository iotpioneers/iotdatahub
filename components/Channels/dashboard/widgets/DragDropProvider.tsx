"use client";

import { Widget } from "@/types/widgets";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { DragOverlayProvider } from "./DragOverlay";

export const DragDropProvider = ({
  children,
  onDrop,
}: {
  children: React.ReactNode;
  onDrop: (widget: Widget) => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("DragEndEvent:", event);

    const { active, over } = event;
    if (over?.id === "dashboard-drop-area" && active.data.current?.widget) {
      onDrop(active.data.current.widget);
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      sensors={sensors}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "To pick up a widget, press space or enter. Use arrow keys to move. Press space or enter again to drop, or escape to cancel.",
        },
      }}
    >
      {" "}
      <DragOverlayProvider>{children}</DragOverlayProvider>
    </DndContext>
  );
};
