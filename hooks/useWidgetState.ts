import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { Widget } from "@/types/widgets";
import {
  WidgetState,
  WidgetHandlers,
  UseWidgetStateReturn,
  WidgetStateStats,
  BatchOperationResult,
  WidgetValidationResult,
  PersistedWidgetState,
  WidgetOperation,
  WidgetOperationError,
} from "@/types/widget-state";
import { getDefaultSize } from "@/app/store/constant";

interface UseWidgetStateOptions {
  /** Device ID for API calls */
  deviceId: string;
  /** Initial widgets data */
  initialWidgets?: Widget[];
  /** Whether to enable localStorage persistence */
  enablePersistence?: boolean;
  /** Custom storage key (defaults to dashboard_edit_{deviceId}) */
  storageKey?: string;
  /** Maximum age for persisted state in milliseconds (default: 1 hour) */
  maxAge?: number;
  /** Whether to auto-save changes periodically */
  autoSave?: boolean;
  /** Auto-save interval in milliseconds (default: 30 seconds) */
  autoSaveInterval?: number;
}

/**
 * Custom hook for managing widget state during editing
 * Provides local state management with persistence and batch operations
 */
export const useWidgetState = (
  options: UseWidgetStateOptions,
): UseWidgetStateReturn => {
  const {
    deviceId,
    initialWidgets = [],
    enablePersistence = true,
    storageKey = `dashboard_edit_${deviceId}`,
    maxAge = 3600000, // 1 hour
    autoSave = false,
    autoSaveInterval = 30000, // 30 seconds
  } = options;

  // Core state
  const [state, setState] = useState<WidgetState>({
    widgets: initialWidgets,
    pendingChanges: {},
    deletedWidgets: [],
  });

  // Refs for cleanup and persistence
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();
  const initialStateRef = useRef<Widget[]>(initialWidgets);

  // Update initial state when prop changes
  useEffect(() => {
    if (initialWidgets.length > 0 && initialStateRef.current.length === 0) {
      initialStateRef.current = initialWidgets;
      setState((prev) => ({
        ...prev,
        widgets: initialWidgets,
      }));
    }
  }, [initialWidgets]);

  // Persistence utilities
  const persistState = useCallback(
    (currentState: WidgetState) => {
      if (!enablePersistence) return;

      try {
        const persistedState: PersistedWidgetState = {
          ...currentState,
          timestamp: Date.now(),
          deviceId,
          version: "1.0",
        };

        localStorage.setItem(storageKey, JSON.stringify(persistedState));
      } catch (error) {
        console.warn("Failed to persist widget state:", error);
      }
    },
    [enablePersistence, deviceId, storageKey],
  );

  const loadPersistedState = useCallback((): WidgetState | null => {
    if (!enablePersistence) return null;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const parsed: PersistedWidgetState = JSON.parse(stored);

      // Check if state is too old
      if (Date.now() - parsed.timestamp > maxAge) {
        localStorage.removeItem(storageKey);
        return null;
      }

      // Validate device ID matches
      if (parsed.deviceId !== deviceId) {
        return null;
      }

      return {
        widgets: parsed.widgets,
        pendingChanges: parsed.pendingChanges,
        deletedWidgets: parsed.deletedWidgets,
      };
    } catch (error) {
      console.warn("Failed to load persisted widget state:", error);
      return null;
    }
  }, [enablePersistence, storageKey, maxAge, deviceId]);

  const clearPersistedState = useCallback(() => {
    if (enablePersistence) {
      localStorage.removeItem(storageKey);
    }
  }, [enablePersistence, storageKey]);

  // Load persisted state on mount
  useEffect(() => {
    const persistedState = loadPersistedState();
    if (persistedState) {
      const hasChanges =
        Object.keys(persistedState.pendingChanges).length > 0 ||
        persistedState.deletedWidgets.length > 0;

      if (hasChanges) {
        const shouldRecover = window.confirm(
          "Found unsaved changes from a previous editing session. Would you like to recover them?",
        );

        if (shouldRecover) {
          setState(persistedState);
        } else {
          clearPersistedState();
        }
      }
    }
  }, [loadPersistedState, clearPersistedState]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const saveToLocal = () => {
      persistState(state);
    };

    autoSaveTimerRef.current = setInterval(saveToLocal, autoSaveInterval);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [autoSave, autoSaveInterval, persistState, state]);

  // State statistics
  const stats: WidgetStateStats = useMemo(() => {
    const newWidgets = Object.values(state.pendingChanges).filter(
      (change) => change.isNew,
    ).length;
    const modifiedWidgets =
      Object.keys(state.pendingChanges).length - newWidgets;

    return {
      totalWidgets: state.widgets.length,
      newWidgets,
      modifiedWidgets,
      deletedWidgets: state.deletedWidgets.length,
      isDirty:
        Object.keys(state.pendingChanges).length > 0 ||
        state.deletedWidgets.length > 0,
    };
  }, [state]);

  // Helper function to find next available position
  const findNextAvailablePosition = useCallback(
    (widgetType?: string) => {
      const occupiedPositions = state.widgets
        .filter((w) => w.position)
        .map((w) => ({
          x: w.position!.x || 0,
          y: w.position!.y || 0,
          w: w.position!.width || 2,
          h: w.position!.height || 3,
        }));

      const defaultSize = getDefaultSize(widgetType);
      const maxCols = 12;

      // Find first available position
      for (let y = 0; y < 100; y++) {
        for (let x = 0; x <= maxCols - defaultSize.w; x++) {
          const proposed = { x, y, w: defaultSize.w, h: defaultSize.h };

          // Check if this position overlaps with any existing widget
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
    [state.widgets],
  );

  // Widget handlers
  const handleAddWidget = useCallback(
    (widget: Widget) => {
      const newWidget = {
        ...widget,
        id: widget.id || `widget-${Date.now()}`,
        deviceId,
        position:
          widget.position || findNextAvailablePosition(widget.definition?.type),
      };

      setState((prev) => {
        const newState = {
          ...prev,
          widgets: [...prev.widgets, newWidget],
          pendingChanges: {
            ...prev.pendingChanges,
            [newWidget.id]: { ...newWidget, isNew: true },
          },
        };
        persistState(newState);
        return newState;
      });
    },
    [deviceId, findNextAvailablePosition, persistState],
  );

  const handleUpdateWidget = useCallback(
    (widgetId: string, changes: Partial<Widget>) => {
      setState((prev) => {
        const newState = {
          ...prev,
          widgets: prev.widgets.map((w) =>
            w.id === widgetId ? { ...w, ...changes } : w,
          ),
          pendingChanges: {
            ...prev.pendingChanges,
            [widgetId]: {
              ...prev.pendingChanges[widgetId],
              ...changes,
            },
          },
        };
        persistState(newState);
        return newState;
      });
    },
    [persistState],
  );

  const handleDeleteWidget = useCallback(
    (widgetId: string) => {
      setState((prev) => {
        const isNewWidget = prev.pendingChanges[widgetId]?.isNew;

        const newState = {
          ...prev,
          widgets: prev.widgets.filter((w) => w.id !== widgetId),
          deletedWidgets: isNewWidget
            ? prev.deletedWidgets
            : [...prev.deletedWidgets, widgetId],
          pendingChanges: { ...prev.pendingChanges },
        };

        // Remove from pending changes if it was a new widget
        if (isNewWidget) {
          delete newState.pendingChanges[widgetId];
        }

        persistState(newState);
        return newState;
      });
    },
    [persistState],
  );

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
        id: `widget-${Date.now()}`,
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

  // Validation
  const validateState = useCallback((): WidgetValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for duplicate IDs
    const ids = state.widgets.map((w) => w.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate widget IDs found: ${duplicateIds.join(", ")}`);
    }

    // Check for widgets without required properties
    state.widgets.forEach((widget) => {
      if (!widget.definition?.type) {
        errors.push(`Widget ${widget.id} is missing definition type`);
      }
      if (!widget.position) {
        warnings.push(`Widget ${widget.id} is missing position information`);
      }
    });

    // Check for overlapping widgets
    const positions = state.widgets
      .filter((w) => w.position)
      .map((w) => ({
        id: w.id,
        x: w.position!.x || 0,
        y: w.position!.y || 0,
        w: w.position!.width || 2,
        h: w.position!.height || 3,
      }));

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i];
        const b = positions[j];

        if (
          a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y
        ) {
          warnings.push(`Widgets ${a.id} and ${b.id} are overlapping`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [state]);

  // Batch save operation using new enhanced API
  const saveChanges = useCallback(async (): Promise<BatchOperationResult> => {
    const { pendingChanges, deletedWidgets } = state;
    const results: BatchOperationResult = {
      successful: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Prepare batch payload
      const newWidgets = Object.entries(pendingChanges)
        .filter(([_, change]) => change.isNew)
        .map(([_, change]) => {
          const { isNew, ...widgetData } = change;
          return widgetData as Widget;
        });

      const updatedWidgets = Object.entries(pendingChanges)
        .filter(([_, change]) => !change.isNew)
        .map(([id, changes]) => {
          const { isNew, ...updateData } = changes;
          return { id, ...updateData };
        });

      const batchPayload = {
        create: newWidgets,
        update: updatedWidgets,
        delete: deletedWidgets,
      };

      // Execute batch operation
      const response = await fetch(`/api/devices/${deviceId}/widgets/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      results.successful = result.successful || 0;
      results.failed = result.failed || 0;
      results.errors = result.errors || [];

      // If all operations succeeded, clear state
      if (results.failed === 0) {
        setState((prev) => ({
          widgets: prev.widgets,
          pendingChanges: {},
          deletedWidgets: [],
        }));
        clearPersistedState();
      }

      return results;
    } catch (error) {
      throw new WidgetOperationError(
        "Failed to save widget changes",
        { type: "CREATE", widget: {} as Widget },
        error instanceof Error ? error : new Error("Unknown error"),
      );
    }
  }, [state, deviceId, clearPersistedState]);

  // Cancel changes
  const cancelChanges = useCallback(() => {
    setState({
      widgets: initialStateRef.current,
      pendingChanges: {},
      deletedWidgets: [],
    });
    clearPersistedState();
  }, [clearPersistedState]);

  // Check if state can be safely discarded
  const canDiscard = useCallback(() => {
    return !stats.isDirty;
  }, [stats.isDirty]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stats.isDirty) {
        e.preventDefault();
        e.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [stats.isDirty]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handlers: WidgetHandlers = {
    onAdd: handleAddWidget,
    onUpdate: handleUpdateWidget,
    onDelete: handleDeleteWidget,
    onMove: handleMoveWidget,
    onDuplicate: handleDuplicateWidget,
  };

  return {
    state,
    stats,
    handlers,
    saveChanges,
    cancelChanges,
    validateState,
    canDiscard,
  };
};
