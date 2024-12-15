"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Box as RadixUIBox } from "@radix-ui/themes";
import Link from "next/link";
import NewDeviceModal from "./NewDeviceModal";

interface Device {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
}

const DeviceListingComponent: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        const data: Device[] = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const handleEdit = (id: number) => {};

  const handleView = (id: number) => {};

  const handleDelete = (id: number) => {};

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Device",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Link href={`devices/${params.row.id}`}>{params.value}</Link>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => (
        <Typography
          className={status === "ONLINE" ? "text-green-500" : "text-red-500"}
        >
          {status}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date created",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)} size="small">
            <EditIcon fontSize="small" color="action" />
          </IconButton>
          <IconButton onClick={() => handleView(params.row.id)} size="small">
            <VisibilityIcon fontSize="small" color="info" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon fontSize="small" color="warning" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <NewDeviceModal />

      <Box m="40px 0 0 0" height="75vh">
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
            autoHeight
            disableRowSelectionOnClick
            slots={{
              toolbar: GridToolbar,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default DeviceListingComponent;
