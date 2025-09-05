"use client";

import React, { useState } from "react";
import { Box, Typography, IconButton, Button, Chip } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Link from "next/link";
import { DeviceData } from "@/types/device";
import { DeviceTabletIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

import EditDeviceModal from "./modals/EditDeviceModal";

interface deviceProps {
  isLoading: boolean;
  devices: DeviceData[];
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const DeviceTable = ({ isLoading, devices }: deviceProps) => {
  const router = useRouter();

  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: string | null;
  }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceData | null>(null);

  const setActionLoading = (deviceId: string, action: string | null) => {
    setLoadingActions((prev) => ({
      ...prev,
      [deviceId]: action,
    }));
  };

  const handleEdit = async (device: DeviceData) => {
    setSelectedDevice(device);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedDevice: Partial<DeviceData>) => {
    if (!selectedDevice) return;

    setActionLoading(selectedDevice.id, "edit");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${selectedDevice.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedDevice),
        },
      );
      if (!response.ok) throw new Error("Failed to update device");

      // Refresh data or update local state
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setActionLoading(selectedDevice.id, null);
      setEditModalOpen(false);
      setSelectedDevice(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedDeviceId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeviceId) return;
    setActionLoading(selectedDeviceId, "delete");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${selectedDeviceId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete device");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeviceId(null);
      setActionLoading(selectedDeviceId, null);
    }
  };

  const handleView = async (id: string) => {
    setActionLoading(id, "view");
    try {
      router.push(`/dashboard/devices/${id}`);
    } finally {
      setActionLoading(id, null);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "",
      headerName: "",
      width: 30,
      renderCell: (params) => (
        <DeviceTabletIcon
          width={36}
          height={36}
          className="text-orange-50 pt-5"
        />
      ),
    },
    {
      field: "name",
      headerName: "Device",
      width: 200,
      renderCell: (params) => (
        <Link
          href={`devices/${params.row.id}`}
          className="text-ellipsis text-blue-500 font-semibold underline"
        >
          {params.value}
        </Link>
      ),
    },
    {
      field: "API Key",
      headerName: "API Key",
      width: 200,
      renderCell: ({ row: { channel } }) => (
        <Typography className="text-ellipsis pt-5">
          {channel?.apiKeys?.[0]?.apiKey}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: ({ row: { status } }) => (
        <Chip
          label={status}
          color={status === "ONLINE" ? "success" : "error"}
        />
      ),
    },
    {
      field: "Device Owner",
      headerName: "Device Owner",
      width: 200,
      renderCell: ({ row: { user } }) => (
        <Typography className=" pt-5">{user.email}</Typography>
      ),
    },
    {
      field: "Organization Name",
      headerName: "Organization Name",
      width: 180,
      renderCell: ({ row: { organization } }) => (
        <Typography className="text-ellipsis pt-5">
          {organization.name}
        </Typography>
      ),
    },
    {
      field: "Channel Name",
      headerName: "Channel Name",
      width: 180,
      renderCell: ({ row: { channel } }) => (
        <Typography className="text-ellipsis pt-5">{channel.name}</Typography>
      ),
    },
    {
      field: "Widgets",
      headerName: "Widgets",
      width: 80,
      renderCell: ({ row: { widgets } }) => (
        <Typography className="font-bold text-orange-50 pt-5">
          {widgets?.length}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date created",
      width: 180,
      renderCell: ({ row: { createdAt } }) => (
        <Typography className="text-ellipsis pt-5">
          {formatDate(new Date(createdAt))}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        const isRowLoading = loadingActions[params.row.id];

        return (
          <div className="flex gap-2">
            <IconButton
              onClick={() => handleEdit(params.row)}
              size="small"
              disabled={!!isRowLoading}
            >
              {isRowLoading === "edit" ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <EditIcon fontSize="small" color="action" />
              )}
            </IconButton>

            <IconButton
              onClick={() => handleView(params.row.id)}
              size="small"
              disabled={!!isRowLoading}
            >
              {isRowLoading === "view" ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <VisibilityIcon fontSize="small" color="info" />
              )}
            </IconButton>

            <IconButton
              onClick={() => handleDelete(params.row.id)}
              size="small"
              disabled={!!isRowLoading}
            >
              {isRowLoading === "delete" ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <DeleteIcon fontSize="small" color="warning" />
              )}
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <Box m="40px 0 0 0" height="75vh">
      {/* Show table skeleton while loading */}
      {isLoading && <DataGrid rows={[]} columns={columns} />}
      {devices.length > 0 && (
        <DataGrid
          rows={devices}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this device?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <EditDeviceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
        isLoading={
          !!selectedDevice && loadingActions[selectedDevice.id] === "edit"
        }
        onSave={handleSaveEdit}
      />
    </Box>
  );
};

export default DeviceTable;
