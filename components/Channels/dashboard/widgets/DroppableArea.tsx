"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableAreaProps {
  id?: string;
  children: React.ReactNode;
}

export const DroppableArea = ({
  id = "dashboard-drop-area",
  children,
}: DroppableAreaProps) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[400px] w-full transition-all duration-200 relative",
        isOver
          ? "bg-blue-50 border-2 border-dashed border-blue-300"
          : "bg-white border border-gray-200",
      )}
      aria-label="Dashboard drop area"
    >
      {children}
    </div>
  );
};
