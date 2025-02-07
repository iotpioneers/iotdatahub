"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Widget } from "@/types/widgets";
import useAdd from "@/hooks/useAdd";

interface DroppableAreaProps {
  id: string;
  children: React.ReactNode;
}

export const DroppableArea = ({
  id,

  children,
}: DroppableAreaProps) => {
  const { setNodeRef } = useDroppable({ id });

  const { add } = useAdd(`/api/devices/${id}/widgets`);

  const handleAddWidget = async (widget: any) => {
    try {
      await add(widget);
    } catch (err) {
      console.error("Failed to add widget:", err);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const rawData = e.dataTransfer.getData("application/json");
      if (!rawData) return;
      const widget = JSON.parse(rawData);
      console.log("Dropped widget:", widget);
      handleAddWidget(widget);
    } catch (error) {
      console.error("Error parsing dropped data:", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-dashed border-2 border-gray-300 hover:border-primary-blue transition duration-300 p-5 min-h-24"
    >
      {children}
    </div>
  );
};
