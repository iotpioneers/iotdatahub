"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import EditDeviceDashboard from "./EditDeviceDashboard";
import { useRouter } from "next/navigation";
import DeviceHeaderComponent from "./DeviceHeaderComponent";
import { DragDropProvider } from "@/components/Channels/dashboard/widgets/DragDropProvider";
import { Widget } from "@/types/widgets";
import useFetch from "@/hooks/useFetch";
import { LinearLoading } from "@/components/LinearLoading";
import { useToast } from "@/components/ui/toast-provider";
import { v4 as uuidv4 } from "uuid";
import { getDefaultSize } from "@/app/store/constant";
import EditDeviceHintModal from "./EditDeviceHintModal";

// Enhanced HintModal for EditDashboard

interface Props {
  params: { id: string };
}

interface WidgetState {
  widgets: Widget[];
  pendingChanges: Record<string, Partial<Widget> & { isNew?: boolean }>;
  deletedWidgets: string[];
}

interface WidgetWithIsNew extends Widget {
  isNew?: boolean;
}

const EditDashboardComponent = ({ params }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [hintStep, setHintStep] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`edit-hint-${params.id}`) ? 0 : 1;
    }
    return 0;
  });

  const initialWidgetsRef = useRef<Widget[]>([]);
  const [widgetState, setWidgetState] = useState<WidgetState>({
    widgets: [],
    pendingChanges: {},
    deletedWidgets: [],
  });

  // Fetch initial widget data
  const {
    data: widgetData,
    isLoading: isWidgetLoading,
    error,
  } = useFetch(`/api/devices/${params.id}/widgets`);

  console.log("Received widget data:---", widgetData, "Error:---", error);

  // Initialize state when data loads
  useEffect(() => {
    if (widgetData) {
      initialWidgetsRef.current = widgetData;
      setWidgetState({
        widgets: widgetData,
        pendingChanges: {},
        deletedWidgets: [],
      });
    }
  }, [widgetData]);

  const editHintSteps = [
    {
      targetId: "widget-box",
      title: "Add Widgets",
      message:
        "Click on any widget type in this box to add it to your dashboard. Choose from charts, gauges, and more.",
      showPreview: true,
      previewType: "add" as const,
    },
    {
      targetId: "dashboard-grid",
      title: "Drag & Drop",
      message:
        "Drag widgets around the dashboard to reposition them. Click and hold to move widgets anywhere.",
      showPreview: true,
      previewType: "drag" as const,
    },
    {
      targetId: "dashboard-grid",
      title: "Resize Widgets",
      message:
        "Drag the corners or edges of widgets to resize them. Make them bigger or smaller as needed.",
      showPreview: true,
      previewType: "resize" as const,
    },
    {
      targetId: "save-button",
      title: "Save Changes",
      message:
        "Click Save & Apply to save your dashboard changes and return to the device view.",
    },
  ];

  const handleHintNext = () => {
    if (hintStep < editHintSteps.length) {
      setHintStep(hintStep + 1);
    } else {
      setHintStep(0);
      localStorage.setItem(`edit-hint-${params.id}`, "completed");
    }
  };

  const handleHintBack = () => {
    if (hintStep > 1) {
      setHintStep(hintStep - 1);
    }
  };

  const handleHintClose = () => {
    setHintStep(0);
    localStorage.setItem(`edit-hint-${params.id}`, "completed");
  };
  const stats = useMemo(() => {
    const newWidgets = Object.values(widgetState.pendingChanges).filter(
      (change) => !initialWidgetsRef.current.some((w) => w.id === change.id),
    ).length;
    const modifiedWidgets =
      Object.keys(widgetState.pendingChanges).length - newWidgets;

    return {
      totalWidgets: widgetState.widgets.length,
      newWidgets,
      modifiedWidgets,
      deletedWidgets: widgetState.deletedWidgets.length,
      isDirty:
        Object.keys(widgetState.pendingChanges).length > 0 ||
        widgetState.deletedWidgets.length > 0,
    };
  }, [widgetState]);

  // Find next available position for new widgets
  const findNextAvailablePosition = useCallback(
    (widgetType?: string) => {
      const defaultSize = getDefaultSize(widgetType);
      const occupiedPositions = widgetState.widgets
        .filter((w) => w.position)
        .map((w) => ({
          x: w.position!.x || 0,
          y: w.position!.y || 0,
          w: w.position!.width || defaultSize.w,
          h: w.position!.height || defaultSize.h,
        }));

      // Find first available position
      for (let y = 0; y < 100; y++) {
        for (let x = 0; x <= 12 - defaultSize.w; x++) {
          const proposed = { x, y, w: defaultSize.w, h: defaultSize.h };

          const overlaps = occupiedPositions.some(
            (existing) =>
              proposed.x < existing.x + existing.w &&
              proposed.x + proposed.w > existing.x &&
              proposed.y < existing.y + existing.h &&
              proposed.y + proposed.h > existing.y,
          );

          if (!overlaps) {
            return {
              x: proposed.x,
              y: proposed.y,
              width: proposed.w,
              height: proposed.h,
            };
          }
        }
      }

      // Fallback: place at bottom
      const maxY = Math.max(0, ...occupiedPositions.map((p) => p.y + p.h));
      return {
        x: 0,
        y: maxY,
        width: defaultSize.w,
        height: defaultSize.h,
      };
    },
    [widgetState.widgets],
  );

  // Widget handlers
  const handleAddWidget = useCallback(
    (widget: Widget) => {
      const newWidget = {
        ...widget,
        id: `temp-${uuidv4()}`,
        deviceId: params.id,
        position:
          widget.position || findNextAvailablePosition(widget.definition?.type),
      };

      setWidgetState((prev) => ({
        ...prev,
        widgets: [...prev.widgets, newWidget],
        pendingChanges: {
          ...prev.pendingChanges,
          [newWidget.id]: { ...newWidget, isNew: true },
        },
      }));
    },
    [params.id, findNextAvailablePosition],
  );

  const handleUpdateWidget = useCallback(
    (widgetId: string, changes: Partial<Widget>) => {
      setWidgetState((prev) => {
        const isNewWidget = !initialWidgetsRef.current.some(
          (w) => w.id === widgetId,
        );
        const existingChanges = prev.pendingChanges[widgetId] || {};

        return {
          ...prev,
          widgets: prev.widgets.map((w) =>
            w.id === widgetId ? { ...w, ...changes } : w,
          ),
          pendingChanges: {
            ...prev.pendingChanges,
            [widgetId]: {
              ...existingChanges,
              ...changes,
              isNew: isNewWidget,
            },
          },
        };
      });
    },
    [],
  );

  const handleDeleteWidget = useCallback((widgetId: string) => {
    setWidgetState((prev) => {
      const isNewWidget = (prev.pendingChanges[widgetId] as WidgetWithIsNew)
        ?.isNew;
      return {
        widgets: prev.widgets.filter((w) => w.id !== widgetId),
        deletedWidgets: isNewWidget
          ? prev.deletedWidgets
          : [...prev.deletedWidgets, widgetId],
        pendingChanges: Object.fromEntries(
          Object.entries(prev.pendingChanges).filter(([id]) => id !== widgetId),
        ),
      };
    });
  }, []);

  const handleMoveWidget = useCallback(
    (widgetId: string, position: Widget["position"]) => {
      handleUpdateWidget(widgetId, { position });
    },
    [handleUpdateWidget],
  );

  const handleDuplicateWidget = useCallback(
    (sourceWidget: Widget) => {
      const duplicatedWidget: Widget = {
        ...sourceWidget,
        id: `temp-${uuidv4()}`,
        name: sourceWidget.name ? `${sourceWidget.name} (Copy)` : undefined,
        position: sourceWidget.position
          ? {
              ...sourceWidget.position,
              x: Math.min((sourceWidget.position.x || 0) + 1, 10),
              y: (sourceWidget.position.y || 0) + 1,
            }
          : findNextAvailablePosition(sourceWidget.definition?.type),
      };

      handleAddWidget(duplicatedWidget);
    },
    [handleAddWidget, findNextAvailablePosition],
  );

  const handleSaveAndApply = async () => {
    if (!stats.isDirty) {
      router.push(`/dashboard/devices/${params.id}`);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare batch payload
      const newWidgets = Object.entries(widgetState.pendingChanges)
        .filter(([_, change]) => change.isNew)
        .map(([_, change]) => {
          const { isNew, ...widgetData } = change;
          return widgetData as Widget;
        });

      const updatedWidgets = Object.entries(widgetState.pendingChanges)
        .filter(([_, change]) => !change.isNew)
        .map(([id, changes]) => {
          const { isNew, ...updateData } = changes;
          return { id, ...updateData };
        });

      const batchPayload = {
        create: newWidgets,
        update: updatedWidgets,
        delete: widgetState.deletedWidgets,
      };

      const response = await fetch(`/api/devices/${params.id}/widgets/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save changes: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.failed > 0) {
        toast({
          message: `Some operations failed: ${result.errors
            .map((e: { error: string }) => e.error)
            .join(", ")}`,

          type: "error",
        });

        return;
      }

      toast({
        message: `Successfully saved ${result.successful} changes`,
        type: "success",
      });

      await new Promise((resolve) => setTimeout(resolve, 10000));

      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      toast({
        message:
          error instanceof Error ? error.message : "Failed to save changes",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!stats.isDirty) {
      router.push(`/dashboard/devices/${params.id}`);
      return;
    }

    const confirmCancel = window.confirm(
      "You have unsaved changes. Are you sure you want to cancel?",
    );
    if (!confirmCancel) return;

    setIsLoading(true);
    try {
      setWidgetState({
        widgets: initialWidgetsRef.current,
        pendingChanges: {},
        deletedWidgets: [],
      });
      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      toast({
        message: "Error canceling changes",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (widget: Widget) => {
    try {
      handleAddWidget(widget);
      toast({
        message: "Widget added to dashboard",
        type: "success",
      });
    } catch (error) {
      toast({
        message: "Failed to add widget",
        type: "error",
      });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            Error loading widgets
          </h3>
          <p className="text-sm text-gray-500">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DragDropProvider onDrop={handleDrop}>
      <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl flex justify-between bg-slate-100 rounded-lg shadow p-2 overflow-hidden gap-1">
        {isWidgetLoading || (isLoading && <LinearLoading />)}
        <div className="grid gap-1 w-full rounded-md">
          <DeviceHeaderComponent
            deviceId={params.id}
            isLoading={isLoading}
            onSave={handleSaveAndApply}
            onCancel={handleCancel}
            isDirty={stats.isDirty}
            stats={stats}
          />

          <div id="dashboard-grid">
            <EditDeviceDashboard
              params={params}
              widgets={widgetState.widgets}
              onUpdate={handleUpdateWidget}
              onDelete={handleDeleteWidget}
              onMove={handleMoveWidget}
              onDuplicate={handleDuplicateWidget}
              isDirty={stats.isDirty}
            />
          </div>
        </div>

        <div
          id="widget-box"
          className="flex flex-1 min-w-[150px] h-full rounded-md"
        >
          <WidgetBox deviceId={params.id} />
        </div>
      </div>

      {hintStep > 0 && (
        <EditDeviceHintModal
          steps={editHintSteps}
          currentStep={hintStep}
          onNext={handleHintNext}
          onBack={handleHintBack}
          onClose={handleHintClose}
          onComplete={() => {
            setHintStep(0);
            localStorage.setItem(`edit-hint-${params.id}`, "completed");
          }}
        />
      )}
    </DragDropProvider>
  );
};

export default EditDashboardComponent;
