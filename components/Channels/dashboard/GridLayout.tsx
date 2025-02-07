"use client";

import React, { useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Widget } from "@/types/widgets";
import WidgetRenderer from "./WidgetRenderer";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props {
  widgets: Widget[];
  onLayoutChange: (layout: any) => void;
  onWidgetSettingsChange: (widgetId: string, settings: any) => void;
  onDeleteWidget: (widgetId: string) => void;
}

const GridLayout: React.FC<Props> = ({
  widgets,
  onLayoutChange,
  onWidgetSettingsChange,
  onDeleteWidget,
}) => {
  const [breakpoint, setBreakpoint] = useState<string>("lg");

  const layouts = {
    lg: widgets.map((widget: Widget) => ({
      i: widget.id,
      x: widget.position?.x ?? 0,
      y: widget.position?.y ?? 0,
      w: widget.position?.width ?? 2,
      h: widget.position?.height ?? 2,
      minW: 2,
      minH: 2,
    })),
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      onBreakpointChange={(newBreakpoint) => setBreakpoint(newBreakpoint)}
      onLayoutChange={(layout, layouts) => onLayoutChange(layouts)}
      draggableHandle=".widget-drag-handle"
    >
      {widgets.map((widget: Widget) => (
        <div key={widget.id} className="bg-white rounded-lg">
          <WidgetRenderer
            widget={widget}
            onSettingsChange={(settings) =>
              onWidgetSettingsChange(widget.id as string, settings)
            }
            onDelete={() => onDeleteWidget(widget.id as string)}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default GridLayout;
