"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarProps,
  GridToolbar,
} from "@mui/x-data-grid";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
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

const DeviceTable: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`
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

  const handleEdit = (id: number) => {
    console.log(`Edit device with id: ${id}`);
  };

  const handleView = (id: number) => {
    console.log(`View device with id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete device with id: ${id}`);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
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
      ),
    },
    {
      field: "createdAt",
      headerName: "Date created",
      flex: 1,
      valueFormatter: (params: { value: Date }) =>
        new Date(params.value).toLocaleDateString(),
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
      <HeadingTexts title="Devices" subtitle="Managing devices" />
      <Button className="button bg-gray-600 p-3 rounded-md">
        <Link href="/dashboard/devices/new">New Device</Link>
      </Button>

      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        {devices.length > 0 && (
          <DataGrid
            rows={devices}
            columns={columns}
            slots={{
              toolbar: GridToolbar,
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default DeviceTable;
