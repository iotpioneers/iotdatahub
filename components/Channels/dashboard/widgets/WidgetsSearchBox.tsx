"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Search, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Widget, WidgetDefinition } from "@/types/widgets";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

// Import icons for preview
import {
  NumberCircleOne,
  Gauge,
  ImageSquare,
  MapPin,
  Terminal,
  SlidersHorizontal,
  SpeakerHigh,
  TextT,
  ChartLine,
  ChartBar,
} from "@phosphor-icons/react";
import { ChartBarIcon } from "@heroicons/react/20/solid";
import { SwitchIcon } from "@radix-ui/react-icons";
import {
  GaugeIcon,
  ImageIcon,
  PlaySquare,
  Menu as MenuIcon,
  Volume2,
} from "lucide-react";
import { WidgetsOutlined } from "@mui/icons-material";

// Widget definitions (same as in WidgetBox)
const adjustWidgetSize = (
  size: { w: number; h: number },
  reduction: number,
) => ({
  w: size.w - reduction,
  h: size.h - reduction,
});

const widgetDefinitions: Record<string, WidgetDefinition[]> = {
  control: [
    {
      type: "switch",
      label: "Switch",
      icon: <SwitchIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "slider",
      label: "Slider",
      icon: <SlidersHorizontal className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "numberInput",
      label: "Number Input",
      icon: <NumberCircleOne className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "imageButton",
      label: "Image Button",
      icon: <ImageIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
  ],
  display: [
    {
      type: "led",
      label: "LED",
      icon: <Gauge className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "label",
      label: "Label",
      icon: <TextT className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "gauge",
      label: "Gauge",
      icon: <GaugeIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "radialGauge",
      label: "Radial Gauge",
      icon: <Gauge className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "alarmSound",
      label: "Alarm and Sound",
      icon: <SpeakerHigh className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
  ],
  chart: [
    {
      type: "chart",
      label: "Chart",
      icon: <ChartBarIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
    {
      type: "customChart",
      label: "Custom Chart",
      icon: <ChartLine className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
    {
      type: "heatmapChart",
      label: "Heatmap Chart",
      icon: <ChartBar className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
  ],
  media: [
    {
      type: "map",
      label: "Map",
      icon: <MapPin className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
    {
      type: "imageGallery",
      label: "Image Gallery",
      icon: <ImageSquare className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
    {
      type: "video",
      label: "Video",
      icon: <PlaySquare className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
  ],
  input: [
    {
      type: "textInput",
      label: "Text Input",
      icon: <TextT className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "terminal",
      label: "Terminal",
      icon: <Terminal className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "segmentedSwitch",
      label: "Segmented Switch",
      icon: <SwitchIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "menu",
      label: "Menu",
      icon: <MenuIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
  ],
  misc: [
    {
      type: "modules",
      label: "Modules",
      icon: <WidgetsOutlined className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "misc",
    },
  ],
};

interface WidgetsSearchBoxProps {
  deviceId?: string;
  onWidgetsSelected?: (widgets: WidgetDefinition[]) => void;
  onRefresh?: () => Promise<void>;
}

const WidgetsSearchBox: React.FC<WidgetsSearchBoxProps> = ({
  deviceId,
  onWidgetsSelected,
  onRefresh,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWidgets, setSelectedWidgets] = useState<Set<string>>(
    new Set(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { showToast } = useToast();
  const closeTimeoutRef = useRef<number | null>(null);

  // Flatten all widgets with their categories
  const allWidgets = useMemo(() => {
    return Object.entries(widgetDefinitions).flatMap(([category, defs]) =>
      defs.map((def) => ({
        ...def,
        category: category as WidgetDefinition["category"],
      })),
    );
  }, []);

  // Filter widgets based on search query
  const filteredWidgets = useMemo(() => {
    if (!searchQuery.trim()) return allWidgets;

    const query = searchQuery.toLowerCase();
    return allWidgets.filter(
      (widget) =>
        widget.label?.toLowerCase().includes(query) ||
        widget.type?.toLowerCase().includes(query) ||
        widget.category?.toLowerCase().includes(query),
    );
  }, [searchQuery, allWidgets]);

  // Group filtered widgets by category
  const groupedWidgets = useMemo(() => {
    const grouped: Record<string, WidgetDefinition[]> = {};
    filteredWidgets.forEach((widget) => {
      const cat = widget.category || "misc";
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(widget);
    });
    return grouped;
  }, [filteredWidgets]);

  // Toggle widget selection
  const toggleWidgetSelection = useCallback((widgetType: string) => {
    setSelectedWidgets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(widgetType)) {
        newSet.delete(widgetType);
      } else {
        newSet.add(widgetType);
      }
      return newSet;
    });
  }, []);

  // Select/Deselect all visible widgets
  const toggleSelectAll = useCallback(() => {
    // If all filtered widgets are selected, deselect all
    if (
      selectedWidgets.size === filteredWidgets.length &&
      filteredWidgets.length > 0
    ) {
      setSelectedWidgets(new Set());
    } else {
      // Otherwise select all filtered widgets
      setSelectedWidgets(new Set(filteredWidgets.map((w) => w.type || "")));
    }
  }, [filteredWidgets, selectedWidgets.size]);

  // Handle adding selected widgets
  const handleAddWidgets = useCallback(async () => {
    const selected = filteredWidgets.filter((w) =>
      selectedWidgets.has(w.type || ""),
    );

    if (selected.length === 0) return;

    setIsLoading(true);
    setStatusMessage({ type: null, message: "" });

    try {
      // Simulate processing time and dispatch events
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dispatch custom event for each selected widget
      selected.forEach((definition) => {
        window.dispatchEvent(
          new CustomEvent("widget-search-add", {
            detail: { widget: definition, deviceId },
          }),
        );
      });

      // Call callback
      if (onWidgetsSelected) {
        onWidgetsSelected(selected);
      }

      // Trigger refresh if callback provided, but don't wait forever
      if (onRefresh) {
        try {
          // race onRefresh against a short timeout to avoid hanging UI
          await Promise.race([
            onRefresh(),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]);
        } catch (err) {
          console.error("Error refreshing widgets:", err);
        }
      }

      // No fallback dispatch here — the parent listens for `widget-search-add`
      // and will add widgets to the dashboard. Avoid duplicate events.

      // Show success message
      const widgetCount = selected.length;
      const successMsg = `Successfully added ${widgetCount} widget${widgetCount !== 1 ? "s" : ""}!`;
      setStatusMessage({ type: "success", message: successMsg });
      showToast(successMsg, "success");

      // stop loading and keep status visible briefly, then close
      setIsLoading(false);
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      closeTimeoutRef.current = window.setTimeout(() => {
        setSelectedWidgets(new Set());
        setSearchQuery("");
        setStatusMessage({ type: null, message: "" });
        setIsOpen(false);
        closeTimeoutRef.current = null;
      }, 1500);
    } catch (error) {
      console.error("Error adding widgets:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to add widgets";
      setStatusMessage({
        type: "error",
        message: errorMsg,
      });
      showToast(errorMsg, "error");
      setIsLoading(false);
    }
  }, [
    filteredWidgets,
    selectedWidgets,
    deviceId,
    onWidgetsSelected,
    onRefresh,
    showToast,
  ]);

  // Reset when modal closes
  const handleClose = useCallback(() => {
    if (isLoading) {
      // prevent closing while processing
      showToast("Operation in progress, please wait...", "info");
      return;
    }

    // clear any pending close timeout
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setIsOpen(false);
    // Don't reset selection/search to maintain context if reopened
  }, [isLoading, showToast]);

  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Search Button */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "w-full px-3 py-2 rounded-lg border border-gray-300 bg-white",
            "flex items-center gap-2 text-gray-600 hover:bg-gray-50",
            "transition-all duration-200 ease-in-out",
          )}
        >
          <Search className="w-4 h-4" />
          <span className="text-sm font-medium">Search widgets...</span>
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={handleClose}
          role="presentation"
        >
          {/* Modal Dialog */}
          <div
            className={cn(
              "fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2",
              "rounded-xl bg-white shadow-2xl",
              "animate-in fade-in slide-in-from-bottom-4 duration-300",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <WidgetsOutlined className="text-gray-700 text-xl" />
                <h2 className="text-lg font-bold text-gray-800">
                  Search & Add Widgets
                </h2>
              </div>
              <button
                onClick={handleClose}
                className={cn(
                  "p-1 rounded-lg hover:bg-gray-100",
                  "transition-colors duration-150",
                )}
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex max-h-[70vh] flex-col gap-4 overflow-hidden p-4">
              {/* Status Message */}
              {statusMessage.type && (
                <div
                  className={cn(
                    "rounded-lg p-3 text-sm font-medium animate-in fade-in duration-200",
                    statusMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200",
                  )}
                >
                  <div className="flex items-center gap-2">
                    {statusMessage.type === "success" ? (
                      <Check className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 flex-shrink-0" />
                    )}
                    {statusMessage.message}
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div className="sticky top-0 z-10 space-y-2">
                <Input
                  placeholder="Search by widget name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-300 bg-gray-50 px-3 py-2"
                  autoFocus
                  disabled={isLoading}
                />

                {/* Selection Summary */}
                <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedWidgets.size} widget(s) selected
                    {allWidgets.length > 0 &&
                      ` of ${allWidgets.length} available`}
                  </span>
                  {allWidgets.length > 0 && !isLoading && (
                    <button
                      onClick={toggleSelectAll}
                      className={cn(
                        "text-xs font-medium px-2 py-1 rounded hover:bg-blue-100",
                        "transition-colors duration-150",
                        selectedWidgets.size === allWidgets.length
                          ? "text-blue-700"
                          : "text-blue-600",
                      )}
                    >
                      {selectedWidgets.size === allWidgets.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  )}
                </div>
              </div>

              {/* Widgets List */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {isLoading ? (
                  <div className="flex h-32 items-center justify-center text-center">
                    <div className="space-y-2">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                      <p className="text-sm font-medium text-gray-700">
                        Adding widgets...
                      </p>
                    </div>
                  </div>
                ) : filteredWidgets.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        No widgets found
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Try a different search term
                      </p>
                    </div>
                  </div>
                ) : (
                  Object.entries(groupedWidgets).map(([category, widgets]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase text-gray-600">
                        {category} ({widgets.length})
                      </h3>
                      <div className="grid gap-2">
                        {widgets.map((widget) => (
                          <label
                            key={widget.type}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border-2 p-3",
                              "cursor-pointer transition-all duration-200",
                              "hover:border-blue-300 hover:bg-blue-50",
                              selectedWidgets.has(widget.type || "")
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white",
                              isLoading && "opacity-50 cursor-not-allowed",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={selectedWidgets.has(widget.type || "")}
                              onChange={() =>
                                toggleWidgetSelection(widget.type || "")
                              }
                              disabled={isLoading}
                              className="h-4 w-4 text-blue-600 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">
                                {widget.label}
                              </div>
                              <div className="text-xs text-gray-500">
                                {widget.type}
                              </div>
                            </div>
                            {widget.icon && (
                              <div className="flex-shrink-0 text-gray-600">
                                {widget.icon}
                              </div>
                            )}
                            {selectedWidgets.has(widget.type || "") &&
                              !isLoading && (
                                <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 flex gap-2 border-t border-gray-200 bg-white pt-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Processing..." : "Cancel"}
                </Button>
                <Button
                  onClick={handleAddWidgets}
                  disabled={selectedWidgets.size === 0 || isLoading}
                  className={cn(
                    "flex-1 bg-blue-600 text-white hover:bg-blue-700",
                    (selectedWidgets.size === 0 || isLoading) &&
                      "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    <>
                      Add{" "}
                      {selectedWidgets.size > 0 && `(${selectedWidgets.size})`}{" "}
                      Widget{selectedWidgets.size !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WidgetsSearchBox;
