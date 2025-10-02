"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { DeviceData } from "@/types/device";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Grid3x3,
  List,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Signal,
  Battery,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeviceFormModal } from "./DeviceFormModal";
import { DataTable } from "@/components/ui/tables/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/toast-provider";
import NewDeviceModal from "./NewDeviceModal";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const statusColors = {
  ONLINE: "bg-green-100 text-green-800 border-green-200",
  OFFLINE: "bg-red-100 text-red-800 border-red-200",
  MAINTENANCE: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));

const DeviceListingComponent: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const toast = useToast();

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`,
      );

      if (!response.ok) throw new Error("Failed to fetch devices");
      const data: DeviceData[] = await response.json();
      setDevices(data);
      setFilteredDevices(data);
    } catch (error) {
      toast.toast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to fetch devices",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Apply filters whenever search term or status filter changes
  useEffect(() => {
    let filtered = [...devices];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter);
    }

    // Apply search term
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.name?.toLowerCase().includes(search) ||
          device.id?.toLowerCase().includes(search) ||
          device.organization?.name?.toLowerCase().includes(search),
      );
    }

    setFilteredDevices(filtered);
  }, [devices, searchQuery, statusFilter]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete device");

      toast.toast({
        type: "success",
        message: "Device deleted successfully",
      });
      fetchDevices();
    } catch (error) {
      toast.toast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to delete device",
      });
    }
  };

  const handleSubmit = async (deviceData: Partial<DeviceData>) => {
    try {
      let response;
      if (selectedDevice && selectedDevice.id) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${selectedDevice.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deviceData),
          },
        );
      } else {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deviceData),
          },
        );
      }

      if (!response.ok) {
        throw new Error(
          selectedDevice
            ? "Failed to update device"
            : "Failed to create device",
        );
      }

      toast.toast({
        type: "success",
        message: selectedDevice
          ? "Device updated successfully"
          : "Device created successfully",
      });

      setIsModalOpen(false);
      fetchDevices();
    } catch (error) {
      toast.toast({
        type: "error",
        message: error instanceof Error ? error.message : "Operation failed",
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  // Table columns
  const columns: ColumnDef<DeviceData>[] = [
    {
      accessorKey: "name",
      header: "Device",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              row.original.status === "ONLINE" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "API Key",
      header: "API Key",
      cell: ({ row }) => (
        <p className="text-ellipsis pt-5">
          {row.original.channel?.apiKeys?.[0]?.apiKey}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={
            statusColors[row.original.status as keyof typeof statusColors]
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "organization",
      header: "Organization",
      cell: ({ row }) => <span>{row.original.organization?.name || "-"}</span>,
    },
    {
      accessorKey: "Widgets",
      header: "Widgets",
      cell: ({ row }) => (
        <p className="font-bold text-orange-50 pt-5">
          {row.original.widgets?.length}
        </p>
      ),
    },
    {
      accessorKey: "lastPing",
      header: "Last Activity",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>
            {row.original.lastPing
              ? formatDate(new Date(row.original.lastPing))
              : "Never"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/devices/${row.original.id}`)
                }
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Details</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(row.original.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Device</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, j) => (
                  <Skeleton key={j} className="h-10 rounded-lg" />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-1">
      {/* Header with gradient and shadow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-10 blur-xl" />
        <div className="relative bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IoT Device Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and monitor your connected devices
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchDevices()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <NewDeviceModal />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
          <div className="w-full md:w-64">
            <SearchInput
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48 border rounded-lg shadow shadow-black">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white shadow shadow-black">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View:</span>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="w-4 h-4 mr-2" />
            Table
          </Button>
        </div>
      </motion.div>

      {/* Active filters */}
      <AnimatePresence>
        {(searchQuery || statusFilter !== "all") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700"
              >
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter("all")}
                  className="ml-2 hover:text-purple-900"
                >
                  ×
                </button>
              </Badge>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {filteredDevices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 border rounded-lg"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Signal className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No devices found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "Try changing your search criteria"
                  : "Add your first device to get started"}
              </p>
            </motion.div>
          ) : viewMode === "grid" ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredDevices.map((device) => (
                  <motion.div
                    key={device.id}
                    variants={cardVariants}
                    whileHover="hover"
                    layout
                  >
                    <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
                      {/* Status bar */}
                      <div
                        className={`h-2 ${
                          device.status === "ONLINE"
                            ? "bg-green-500"
                            : device.status === "OFFLINE"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      />

                      {/* Device content */}
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {device.name}
                            </h3>
                            <p className="text-sm text-gray-500">{device.id}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              statusColors[
                                device.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {device.status}
                          </Badge>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-2 mb-6">
                          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Signal className="w-5 h-5 text-gray-500 mb-1" />
                            <span className="text-sm font-bold">
                              {device.signal ?? "-"}
                            </span>
                            <span className="text-xs text-gray-500">
                              Signal
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Battery className="w-5 h-5 text-gray-500 mb-1" />
                            <span className="text-sm font-bold">
                              {device.batteryLevel ?? "-"}
                            </span>
                            <span className="text-xs text-gray-500">
                              Battery
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-gray-500 mb-1" />
                            <span className="text-sm font-bold">
                              {device.alerts?.length ?? 0}
                            </span>
                            <span className="text-xs text-gray-500">
                              Alerts
                            </span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Clock className="w-5 h-5 text-gray-500 mb-1" />
                            <span className="text-sm font-bold">
                              {device.lastPing
                                ? formatDate(new Date(device.lastPing))
                                : "Never"}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last Ping
                            </span>
                          </div>
                        </div>

                        {/* Organization */}
                        {device.organization && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500">
                              Organization
                            </p>
                            <p className="font-medium">
                              {device.organization.name}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/dashboard/devices/${device.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(device.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <DataTable columns={columns} data={filteredDevices} pagination />
          )}
        </>
      )}

      {/* Device form modal */}
      <DeviceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        device={selectedDevice}
      />
    </div>
  );
};

export default DeviceListingComponent;
