"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import {
  DataGrid,
  GridCellParams,
  GridRowsProp,
  GridColDef,
} from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

type SparkLineData = number[];

function getLastNDays(n: number) {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }
  return result;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getLastNDays(30);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="line"
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
        xAxis={{
          scaleType: "band",
          data,
        }}
      />
    </div>
  );
}

function renderRole(role: "ADMIN" | "USER") {
  const colors: { [index: string]: "error" | "primary" } = {
    ADMIN: "error",
    USER: "primary",
  };

  return <Chip label={role} color={colors[role]} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>
) {
  if (params.value == null) {
    return "";
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: "32px",
        height: "32px",
        fontSize: "1rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  {
    field: "avatar",
    headerName: "Avatar",
    width: 60,
    renderCell: renderAvatar,
  },
  { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
  { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
  {
    field: "role",
    headerName: "Role",
    flex: 0.7,
    minWidth: 100,
    renderCell: (params) => renderRole(params.value as any),
  },
  {
    field: "devices",
    headerName: "Devices",
    headerAlign: "right",
    align: "right",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "channels",
    headerName: "Channels",
    headerAlign: "right",
    align: "right",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "fields",
    headerName: "Fields",
    headerAlign: "right",
    align: "right",
    flex: 0.5,
    minWidth: 80,
  },
  {
    field: "dataUploads",
    headerName: "Data Uploads",
    headerAlign: "right",
    align: "right",
    flex: 0.8,
    minWidth: 120,
  },
  {
    field: "lastLogin",
    headerName: "Last Login",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "activityTrend",
    headerName: "Activity Trend",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows: GridRowsProp = [
  {
    id: 1,
    avatar: { name: "Jean Mugisha", color: "#1976d2" },
    name: "Jean Mugisha",
    email: "jean.mugisha@example.rw",
    role: "ADMIN",
    devices: 15,
    channels: 45,
    fields: 120,
    dataUploads: 15000,
    lastLogin: "2m ago",
    activityTrend: [
      10, 8, 12, 15, 20, 18, 22, 25, 23, 27, 30, 28, 32, 35, 33, 38, 40, 42, 45,
      43, 48, 50, 52, 55, 53, 58, 60, 62, 65, 63,
    ],
  },
  {
    id: 2,
    avatar: { name: "Marie Uwase", color: "#388e3c" },
    name: "Marie Uwase",
    email: "marie.uwase@example.rw",
    role: "USER",
    devices: 8,
    channels: 24,
    fields: 64,
    dataUploads: 8000,
    lastLogin: "1h ago",
    activityTrend: [
      5, 7, 6, 8, 10, 9, 11, 13, 12, 15, 14, 16, 18, 17, 20, 19, 21, 23, 22, 25,
      24, 26, 28, 27, 30, 29, 31, 33, 32, 35,
    ],
  },
  {
    id: 3,
    avatar: { name: "Eric Nshimiyimana", color: "#f57c00" },
    name: "Eric Nshimiyimana",
    email: "eric.nshimiyimana@example.rw",
    role: "USER",
    devices: 5,
    channels: 15,
    fields: 40,
    dataUploads: 5000,
    lastLogin: "3h ago",
    activityTrend: [
      3, 4, 5, 4, 6, 7, 8, 7, 9, 10, 11, 10, 12, 13, 14, 13, 15, 16, 17, 16, 18,
      19, 20, 19, 21, 22, 23, 22, 24, 25,
    ],
  },
  {
    id: 4,
    avatar: { name: "Diane Karenzi", color: "#d32f2f" },
    name: "Diane Karenzi",
    email: "diane.karenzi@example.rw",
    role: "USER",
    devices: 2,
    channels: 6,
    fields: 16,
    dataUploads: 2000,
    lastLogin: "1d ago",
    activityTrend: [
      1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11,
      13, 12, 14, 13, 15, 14, 16,
    ],
  },
  {
    id: 5,
    avatar: { name: "Claude Habimana", color: "#7b1fa2" },
    name: "Claude Habimana",
    email: "claude.habimana@example.rw",
    role: "ADMIN",
    devices: 12,
    channels: 36,
    fields: 96,
    dataUploads: 12000,
    lastLogin: "5m ago",
    activityTrend: [
      8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44,
      46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66,
    ],
  },
  {
    id: 6,
    avatar: { name: "Olivia Umutoni", color: "#0288d1" },
    name: "Olivia Umutoni",
    email: "olivia.umutoni@example.rw",
    role: "USER",
    devices: 6,
    channels: 18,
    fields: 48,
    dataUploads: 6000,
    lastLogin: "2h ago",
    activityTrend: [
      4, 6, 5, 7, 9, 8, 10, 12, 11, 14, 13, 15, 17, 16, 19, 18, 20, 22, 21, 24,
      23, 25, 27, 26, 29, 28, 30, 32, 31, 34,
    ],
  },
  {
    id: 7,
    avatar: { name: "Pascal Ndayisenga", color: "#fbc02d" },
    name: "Pascal Ndayisenga",
    email: "pascal.ndayisenga@example.rw",
    role: "USER",
    devices: 4,
    channels: 12,
    fields: 32,
    dataUploads: 4000,
    lastLogin: "4h ago",
    activityTrend: [
      2, 3, 4, 3, 5, 6, 7, 6, 8, 9, 10, 9, 11, 12, 13, 12, 14, 15, 16, 15, 17,
      18, 19, 18, 20, 21, 22, 21, 23, 24,
    ],
  },
  {
    id: 8,
    avatar: { name: "Yvette Ishimwe", color: "#00796b" },
    name: "Yvette Ishimwe",
    email: "yvette.ishimwe@example.rw",
    role: "ADMIN",
    devices: 10,
    channels: 30,
    fields: 80,
    dataUploads: 10000,
    lastLogin: "10m ago",
    activityTrend: [
      7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43,
      45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65,
    ],
  },
  {
    id: 9,
    avatar: { name: "Alphonse Niyonshuti", color: "#e64a19" },
    name: "Alphonse Niyonshuti",
    email: "alphonse.niyonshuti@example.rw",
    role: "USER",
    devices: 3,
    channels: 9,
    fields: 24,
    dataUploads: 3000,
    lastLogin: "6h ago",
    activityTrend: [
      1, 2, 3, 2, 4, 5, 6, 5, 7, 8, 9, 8, 10, 11, 12, 11, 13, 14, 15, 14, 16,
      17, 18, 17, 19, 20, 21, 20, 22, 23,
    ],
  },
  {
    id: 10,
    avatar: { name: "Jacqueline Mukamana", color: "#5e35b1" },
    name: "Jacqueline Mukamana",
    email: "jacqueline.mukamana@example.rw",
    role: "USER",
    devices: 7,
    channels: 21,
    fields: 56,
    dataUploads: 7000,
    lastLogin: "30m ago",
    activityTrend: [
      6, 8, 7, 9, 11, 10, 12, 14, 13, 16, 15, 17, 19, 18, 21, 20, 22, 24, 23,
      26, 25, 27, 29, 28, 31, 30, 32, 34, 33, 36,
    ],
  },
];

export default function UserManagementDashboard() {
  return (
    <div style={{ height: 650, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </div>
  );
}
