"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import NewDeviceModal from "./NewDeviceModal";
import { DeviceData } from "@/types/device";
import { RoomTabs } from "./RoomTabs";
import { UsageChart } from "./UsageChart";
import { DeviceGrid } from "./DeviceGrid";
import { AddCard } from "@mui/icons-material";
import TemperatureCard from "./TemperatureCard";
import LightControls from "./LightControls";

const DeviceListingComponent: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [activeRoom, setActiveRoom] = useState("Living Room");
  const [isLoading, setIsLoading] = useState(true);
  const [usageData] = useState([
    { time: "9:00", value: 20 },
    { time: "10:00", value: 25 },
    { time: "11:00", value: 30 },
    { time: "12:00", value: 35 },
    { time: "13:00", value: 25 },
    { time: "14:00", value: 30 },
    { time: "15:00", value: 35 },
    { time: "16:00", value: 40 },
    { time: "17:00", value: 30 },
    { time: "18:00", value: 25 },
  ]);

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        const data: DeviceData[] = await response.json();

        console.log("Devices", data);

        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter(
    (device) => device.metadata?.room === activeRoom,
  );

  const handleDeviceToggle = async (id: string, status: boolean) => {
    try {
      // Update device status through API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status ? "ONLINE" : "OFFLINE" }),
        },
      );

      if (!response.ok) throw new Error("Failed to update device");

      // Update local state
      setDevices(
        devices.map((device) =>
          device.id === id
            ? { ...device, status: status ? "ONLINE" : "OFFLINE" }
            : device,
        ),
      );
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

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
    <div className="max-w-7xl mx-auto p-3 space-y-3">
      {/* Header with Add Device button */}
      <div className="grid md:flex justify-between items-center gap-2">
        <NewDeviceModal />
        {/* Room Navigation */}
        {/* <RoomTabs /> */}
      </div>

      {/* DataGrid*/}
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
      </Box>

      {/* Top Section - Devices and Light Controls side by side */}
      <div className="grid grid-rows lg:grid-cols-12 gap-6">
        {/* Devices Grid */}
        <div className="col-span-6 md:col-span-8">{/* <DeviceGrid /> */}</div>

        {/* Light Controls */}
        <div className="col-span-6 md:col-span-4">
          {/* <LightControls /> */}
        </div>
      </div>

      {/* Bottom Section - Temperature and Usage */}
      <div className="grid grid-cols-12 gap-6">
        {/* Temperature Card */}
        <div className="col-span-4 h-[200px]">{/* <TemperatureCard /> */}</div>

        {/* Usage Chart */}
        <div className="col-span-8 h-[200px]">
          {/* <UsageChart title="Usage Status" unit="kWh" data={usageData} /> */}
        </div>
      </div>
    </div>
  );
};

export default DeviceListingComponent;
