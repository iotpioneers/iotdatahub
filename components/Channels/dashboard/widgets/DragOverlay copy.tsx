"use client";

import { useDndMonitor } from "@dnd-kit/core";
import { useState } from "react";
import { Widget } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";

export const DragOverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);

  useDndMonitor({
    onDragStart: ({ active }) => {
      if (active.data.current?.widget) {
        setDraggedWidget(active.data.current.widget);
      }
    },
    onDragEnd: () => {
      setDraggedWidget(null);
    },
    onDragCancel: () => {
      setDraggedWidget(null);
    },
  });

  return (
    <>
      {children}
      {draggedWidget && (
        <div className="fixed inset-0 pointer-events-none z-[999] flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 transform scale-110">
            <WidgetRegistry
              type={draggedWidget.definition?.type ?? "label"}
              settings={draggedWidget.settings || {}}
            />
          </div>
        </div>
      )}
    </>
  );
};
