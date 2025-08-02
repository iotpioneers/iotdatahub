"use client";

import React, { useState, useEffect, useCallback } from "react";
import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import EditDeviceDashboard from "./EditDeviceDashboard";
import { useRouter } from "next/navigation";
import DeviceSidebar from "./DeviceSidebar";
import DeviceHeaderComponent from "./DeviceHeaderComponent";
import { DragDropProvider } from "@/components/Channels/dashboard/widgets/DragDropProvider";
import { Widget } from "@/types/widgets";
import useFetch from "@/hooks/useFetch";

// Types for state management
interface WidgetState {
  widgets: Widget[];
  pendingChanges: Record<string, Partial<Widget & { isNew?: boolean }>>;
  deletedWidgets: string[];
}

interface WidgetHandlers {
  onAdd: (widget: Widget) => void;
  onUpdate: (id: string, changes: Partial<Widget>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: Widget["position"]) => void;
}

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Core widget state
  const [widgetState, setWidgetState] = useState<WidgetState>({
    widgets: [],
    pendingChanges: {},
    deletedWidgets: [],
  });

  console.log("====================================");
  console.log("EditDashboardComponent mounted with widgetState:", widgetState);
  console.log("====================================");

  // Fetch initial widget data
  const { data: initialWidgets, isLoading: isLoadingWidgets } = useFetch(
    `/api/devices/${params.id}/widgets`,
  );

  // Initialize widgets from API data
  useEffect(() => {
    if (initialWidgets) {
      setWidgetState((prev) => ({
        ...prev,
        widgets: initialWidgets,
      }));
    }
  }, [initialWidgets]);

  // Persist editing state to localStorage for recovery
  const persistStateToStorage = useCallback(
    (state: WidgetState) => {
      try {
        localStorage.setItem(
          `dashboard_edit_${params.id}`,
          JSON.stringify({
            ...state,
            timestamp: Date.now(),
          }),
        );
      } catch (error) {
        console.warn("Failed to persist editing state:", error);
      }
    },
    [params.id],
  );

  // Recover editing state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`dashboard_edit_${params.id}`);
      if (stored) {
        const { timestamp, ...state } = JSON.parse(stored);
        // Only recover if less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
          const hasChanges =
            Object.keys(state.pendingChanges).length > 0 ||
            state.deletedWidgets.length > 0;

          if (hasChanges) {
            const shouldRecover = window.confirm(
              "Found unsaved changes from a previous editing session. Would you like to recover them?",
            );

            if (shouldRecover) {
              setWidgetState((prev) => ({ ...prev, ...state }));
              setIsDirty(true);
            }
          }
        }
      }
    } catch (error) {
      console.warn("Failed to recover editing state:", error);
    }
  }, [params.id]);

  // Widget handlers
  const handleAddWidget = useCallback(
    (widget: Widget) => {
      const newWidget = {
        ...widget,
        id: widget.id || `widget-${Date.now()}`,
        deviceId: params.id,
      };

      setWidgetState((prev) => {
        const newState = {
          ...prev,
          widgets: [...prev.widgets, newWidget],
          pendingChanges: {
            ...prev.pendingChanges,
            [newWidget.id]: { ...newWidget, isNew: true },
          },
        };
        persistStateToStorage(newState);
        return newState;
      });

      setIsDirty(true);
    },
    [params.id, persistStateToStorage],
  );

  const handleUpdateWidget = useCallback(
    (widgetId: string, updates: Partial<Widget>) => {
      setWidgetState((prev) => {
        const newState = {
          ...prev,
          widgets: prev.widgets.map((w) =>
            w.id === widgetId ? { ...w, ...updates } : w,
          ),
          pendingChanges: {
            ...prev.pendingChanges,
            [widgetId]: {
              ...prev.pendingChanges[widgetId],
              ...updates,
            },
          },
        };
        persistStateToStorage(newState);
        return newState;
      });

      setIsDirty(true);
    },
    [persistStateToStorage],
  );

  const handleMoveWidget = useCallback(
    (widgetId: string, position: Widget["position"]) => {
      handleUpdateWidget(widgetId, { position });
    },
    [handleUpdateWidget],
  );

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      setWidgetState((prev) => {
        const widget = prev.widgets.find((w) => w.id === widgetId);
        const isNewWidget = prev.pendingChanges[widgetId]?.isNew;

        const newState = {
          ...prev,
          widgets: prev.widgets.filter((w) => w.id !== widgetId),
          deletedWidgets: isNewWidget
            ? prev.deletedWidgets // Don't track deletion of new widgets
            : [...prev.deletedWidgets, widgetId],
          pendingChanges: {
            ...prev.pendingChanges,
          },
        };

        // Remove from pending changes if it was a new widget
        if (isNewWidget) {
          delete newState.pendingChanges[widgetId];
        }

        persistStateToStorage(newState);
        return newState;
      });

      setIsDirty(true);
    },
    [persistStateToStorage],
  );

  const handlers: WidgetHandlers = {
    onAdd: handleAddWidget,
    onUpdate: handleUpdateWidget,
    onDelete: handleDeleteWidget,
    onMove: handleMoveWidget,
  };

  // Batch save all changes to database
  const handleSaveAndApply = async () => {
    if (!isDirty) {
      router.push(`/dashboard/devices/${params.id}`);
      return;
    }

    setIsLoading(true);
    try {
      const { pendingChanges, deletedWidgets } = widgetState;

      // Prepare batch operations
      const operations = [];

      // Create new widgets
      const createPromises = Object.entries(pendingChanges)
        .filter(([_, change]) => change.isNew)
        .map(([id, widget]) => {
          const { isNew, ...widgetData } = widget;
          return fetch(`/api/devices/${params.id}/widgets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(widgetData),
          });
        });
      operations.push(...createPromises);

      // Update existing widgets
      const updatePromises = Object.entries(pendingChanges)
        .filter(([_, change]) => !change.isNew)
        .map(([id, changes]) => {
          const { isNew, ...updateData } = changes;
          return fetch(`/api/devices/${params.id}/widgets/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          });
        });
      operations.push(...updatePromises);

      // Delete widgets
      const deletePromises = deletedWidgets.map((id) =>
        fetch(`/api/devices/${params.id}/widgets/${id}`, {
          method: "DELETE",
        }),
      );
      operations.push(...deletePromises);

      // Execute all operations
      const results = await Promise.allSettled(operations);

      // Check for failures
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length > 0) {
        throw new Error(`${failures.length} operations failed`);
      }

      const rejectedResponses = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => (result as PromiseFulfilledResult<Response>).value)
        .filter((response) => !response.ok);

      if (rejectedResponses.length > 0) {
        throw new Error(`${rejectedResponses.length} requests failed`);
      }

      // Clear editing state
      setWidgetState((prev) => ({
        widgets: prev.widgets,
        pendingChanges: {},
        deletedWidgets: [],
      }));

      setIsDirty(false);

      // Clear localStorage
      localStorage.removeItem(`dashboard_edit_${params.id}`);

      // Navigate to view mode
      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      console.error("Error saving dashboard changes:", error);

      // Optionally implement rollback here
      const shouldRetry = window.confirm(
        "Failed to save changes. Would you like to try again? (Click Cancel to continue editing)",
      );

      if (shouldRetry) {
        // Retry the save operation
        setTimeout(() => handleSaveAndApply(), 1000);
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (isDirty) {
      const shouldDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?",
      );

      if (!shouldDiscard) {
        return;
      }
    }

    setIsLoading(true);
    try {
      // Clear editing state
      setWidgetState({
        widgets: initialWidgets || [],
        pendingChanges: {},
        deletedWidgets: [],
      });

      setIsDirty(false);

      // Clear localStorage
      localStorage.removeItem(`dashboard_edit_${params.id}`);

      // Navigate back
      router.push(`/dashboard/devices/${params.id}`);
    } catch (error) {
      console.error("Error canceling dashboard changes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isDirty, initialWidgets, params.id, router]);

  // Prevent accidental navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Show loading while fetching initial data
  if (isLoadingWidgets) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <DragDropProvider onDrop={handleAddWidget}>
      <div className="max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl xxl:max-w-screen-xxl flex justify-between bg-slate-100 rounded-lg shadow p-2 overflow-hidden gap-1">
        <DeviceSidebar
          deviceId={params.id}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex flex-1 min-w-[200px] h-full rounded-md">
          <WidgetBox
            deviceId={params.id}
            onWidgetAdded={(widgetId) => {
              // Optionally handle widget added callback
              console.log("Widget added:", widgetId);
            }}
          />
        </div>

        <div className="grid gap-1 w-full rounded-md">
          <DeviceHeaderComponent
            deviceId={params.id}
            isLoading={isLoading}
            onSave={handleSaveAndApply}
            onCancel={handleCancel}
            isDirty={isDirty} // Pass dirty state for UI feedback
          />

          <EditDeviceDashboard
            params={params}
            widgets={widgetState.widgets}
            handlers={handlers}
            isDirty={isDirty}
          />
        </div>
      </div>
    </DragDropProvider>
  );
};

export default EditDashboardComponent;
