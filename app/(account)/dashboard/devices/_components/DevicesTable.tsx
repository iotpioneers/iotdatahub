"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import HeadingTexts from "@/components/HeadingTexts";
import { Button, Box as RadixUIBox } from "@radix-ui/themes";
import Link from "@/components/Link";

interface Device {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "2-digit",
  }).format(new Date(date));

const DeviceTable = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/devices");
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

  if (!devices) return null;

  const handleEdit = (id: number) => {
    // Handle edit action
    console.log(`Edit device with id: ${id}`);
  };

  const handleView = (id: number) => {
    // Handle view action
    console.log(`View device with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    // Handle delete action
    console.log(`Delete device with id: ${id}`);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
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
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => {
        return (
          <RadixUIBox
            className={`flex p-1 justify-center ${
              status === "OFFLINE"
                ? "bg-red-600"
                : status === "ONLINE"
                ? "bg-green-700"
                : "bg-yellow-700"
            } rounded-md`}
          >
            {status === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {status === "manager" && <SecurityOutlinedIcon />}
            <Typography color="#e0e0e0" sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </RadixUIBox>
        );
      },
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
          <IconButton
            onClick={() => handleEdit(params.row.id)}
            className="h-4 w-4"
          >
            <EditIcon className="h-3 w-3" color="action" />
          </IconButton>
          <IconButton
            onClick={() => handleView(params.row.id)}
            className="h-4 w-4"
          >
            <VisibilityIcon className="h-3 w-3" color="info" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            className="h-4 w-4"
          >
            <DeleteIcon className="h-3 w-3" color="warning" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box m="20px">
      <HeadingTexts title="Devices" subtitle="Managing the members devices" />
      <Button className="button bg-gray-600 p-3 rounded-md">
        <Link href="/dashboard/devices/new">New Device</Link>
      </Button>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            color: "#ffffff",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: "#000000",
          },
          "& .name-column--cell": {
            color: "#94e2cd",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#888888",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#927382",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#ffffff",
          },
          "& .MuiCheckbox-root": {
            color: "#b7ebde !important",
          },
        }}
      >
        {devices && devices.length !== 0 && (
          <DataGrid
            autoHeight
            rows={devices}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>
    </Box>
  );
};

export default DeviceTable;
