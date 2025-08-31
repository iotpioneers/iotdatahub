import { Widget } from "@/types/widgets";

/**
 * Core widget state structure for local editing
 */
export interface WidgetState {
  /** Current widget configurations in the editor */
  widgets: Widget[];
  /** Track modifications made during editing, keyed by widget ID */
  pendingChanges: Record<string, Partial<Widget & { isNew?: boolean }>>;
  /** Track widgets marked for deletion by ID */
  deletedWidgets: string[];
}

/**
 * Widget operation handlers for state management
 */
export interface WidgetHandlers {
  /** Add a new widget to local state */
  onAdd: (widget: Widget) => void;
  /** Update widget properties in local state */
  onUpdate: (id: string, changes: Partial<Widget>) => void;
  /** Mark widget for deletion in local state */
  onDelete: (id: string) => void;
  /** Update widget position/size in local state */
  onMove: (id: string, position: Widget["position"]) => void;
  /** Duplicate an existing widget */
  onDuplicate: (widget: Widget) => void;
}

/**
 * Extended widget state with metadata for persistence
 */
export interface PersistedWidgetState extends WidgetState {
  /** Timestamp when state was last saved to localStorage */
  timestamp: number;
  /** Device ID this state belongs to */
  deviceId: string;
  /** Version for state migration if needed */
  version?: string;
}

/**
 * Widget operation types for batch processing
 */
export type WidgetOperation =
  | { type: "CREATE"; widget: Widget }
  | { type: "UPDATE"; id: string; changes: Partial<Widget> }
  | { type: "DELETE"; id: string }
  | { type: "MOVE"; id: string; position: Widget["position"] };

/**
 * Batch operation result
 */
export interface BatchOperationResult {
  /** Number of successful operations */
  successful: number;
  /** Number of failed operations */
  failed: number;
  /** Error details for failed operations */
  errors: Array<{
    operation: WidgetOperation;
    error: string;
  }>;
}

/**
 * Widget state reducer action types
 */
export type WidgetStateAction =
  | { type: "INITIALIZE"; payload: { widgets: Widget[] } }
  | { type: "ADD_WIDGET"; payload: { widget: Widget } }
  | {
      type: "UPDATE_WIDGET";
      payload: { id: string; changes: Partial<Widget> };
    }
  | { type: "DELETE_WIDGET"; payload: { id: string } }
  | {
      type: "MOVE_WIDGET";
      payload: { id: string; position: Widget["position"] };
    }
  | { type: "RESET_CHANGES"; payload?: undefined }
  | { type: "RESTORE_STATE"; payload: { state: WidgetState } };

/**
 * Configuration for widget state persistence
 */
export interface PersistenceConfig {
  /** Storage key prefix */
  keyPrefix: string;
  /** Maximum age in milliseconds before state expires */
  maxAge: number;
  /** Whether to compress stored data */
  compress: boolean;
  /** Whether to encrypt stored data */
  encrypt: boolean;
}

/**
 * Widget validation result
 */
export interface WidgetValidationResult {
  /** Whether the widget is valid */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * Widget state statistics
 */
export interface WidgetStateStats {
  /** Total number of widgets */
  totalWidgets: number;
  /** Number of new widgets not yet persisted */
  newWidgets: number;
  /** Number of modified widgets */
  modifiedWidgets: number;
  /** Number of widgets marked for deletion */
  deletedWidgets: number;
  /** Whether there are any unsaved changes */
  isDirty: boolean;
}

/**
 * Hook return type for widget state management
 */
export interface UseWidgetStateReturn {
  /** Current widget state */
  state: WidgetState;
  /** State statistics */
  stats: WidgetStateStats;
  /** Widget operation handlers */
  handlers: WidgetHandlers;
  /** Save all changes to the server */
  saveChanges: () => Promise<BatchOperationResult>;
  /** Cancel all changes and restore original state */
  cancelChanges: () => void;
  /** Validate current state */
  validateState: () => WidgetValidationResult;
  /** Check if state can be safely discarded */
  canDiscard: () => boolean;
}

/**
 * Error types for widget operations
 */
export class WidgetOperationError extends Error {
  constructor(
    message: string,
    public operation: WidgetOperation,
    public cause?: Error,
  ) {
    super(message);
    this.name = "WidgetOperationError";
  }
}

export class WidgetValidationError extends Error {
  constructor(
    message: string,
    public widget: Widget,
    public validationErrors: string[],
  ) {
    super(message);
    this.name = "WidgetValidationError";
  }
}

export class StatePersistenceError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = "StatePersistenceError";
  }
}

/**
 * Utility type for widget diff operations
 */
export interface WidgetDiff {
  /** Widget ID */
  id: string;
  /** Type of change */
  changeType: "added" | "modified" | "deleted" | "moved";
  /** Previous state (if applicable) */
  previous?: Widget;
  /** Current state (if applicable) */
  current?: Widget;
  /** Specific changes made */
  changes?: Partial<Widget>;
}

/**
 * Configuration for optimistic updates
 */
export interface OptimisticUpdateConfig {
  /** Whether to enable optimistic updates */
  enabled: boolean;
  /** Timeout in milliseconds before rolling back failed updates */
  rollbackTimeout: number;
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Delay between retry attempts in milliseconds */
  retryDelay: number;
}

/**
 * Batch API payload structure
 */
export interface BatchWidgetPayload {
  /** Widgets to create */
  create: Widget[];
  /** Widgets to update */
  update: Array<{ id: string } & Partial<Widget>>;
  /** Widget IDs to delete */
  delete: string[];
}
