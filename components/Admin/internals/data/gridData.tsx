import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { GridCellParams, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

type SparkLineData = number[];

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", { month: "short" });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getDaysInMonth(4, 2024);
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
        plotType="bar"
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

function renderStatus(status: "ONLINE" | "OFFLINE" | "DISCONNECTED") {
  const colors: { [index: string]: "success" | "default" | "error" } = {
    ONLINE: "success",
    OFFLINE: "default",
    DISCONNECTED: "error",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
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
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  { field: "device", headerName: "Device", flex: 1.5, minWidth: 200 },
  {
    field: "status",
    headerName: "Status",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.value as any),
  },
  {
    field: "channels",
    headerName: "Channels",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "dataPoints",
    headerName: "Data Points",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "fields",
    headerName: "Fields",
    headerAlign: "right",
    align: "right",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "lastUpdated",
    headerName: "Last Updated",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "dataActivity",
    headerName: "Data Activity",
    flex: 1,
    minWidth: 150,
    renderCell: renderSparklineCell,
  },
];

export const rows: GridRowsProp = [
  {
    id: 1,
    device: "Temperature Monitoring",
    status: "ONLINE",
    channels: 5,
    dataPoints: 12500,
    fields: 3,
    lastUpdated: "2m ago",
    dataActivity: [
      469, 488, 592, 617, 640, 632, 668, 807, 749, 944, 911, 844, 992, 1143,
      1446, 1267, 1362, 1348, 1560, 1670, 1695, 1916, 1823, 1683, 2025, 2529,
      3263, 3296, 3041, 2599,
    ],
  },
  {
    id: 2,
    device: "Humidity Sensors",
    status: "ONLINE",
    channels: 3,
    dataPoints: 8750,
    fields: 2,
    lastUpdated: "5m ago",
    dataActivity: [
      300, 320, 350, 380, 400, 420, 450, 480, 500, 520, 550, 580, 600, 620, 650,
      680, 700, 720, 750, 780, 800, 820, 850, 880, 900, 920, 950, 980, 1000,
      1020,
    ],
  },
  {
    id: 3,
    device: "Pressure Monitoring",
    status: "OFFLINE",
    channels: 2,
    dataPoints: 6250,
    fields: 1,
    lastUpdated: "1h ago",
    dataActivity: [
      166, 190, 248, 226, 261, 271, 332, 381, 396, 495, 520, 460, 704, 559, 681,
      712, 765, 771, 851, 907, 903, 1049, 1003, 881, 1072, 1139, 1382, 1395,
      1355, 1381,
    ],
  },
  {
    id: 4,
    device: "Smart Home Control",
    status: "ONLINE",
    channels: 10,
    dataPoints: 25000,
    fields: 8,
    lastUpdated: "1m ago",
    dataActivity: [
      500, 520, 550, 580, 600, 620, 650, 680, 700, 720, 750, 780, 800, 820, 850,
      880, 900, 920, 950, 980, 1000, 1020, 1050, 1080, 1100, 1120, 1150, 1180,
      1200, 1220,
    ],
  },
  {
    id: 5,
    device: "Energy Consumption",
    status: "ONLINE",
    channels: 7,
    dataPoints: 17500,
    fields: 4,
    lastUpdated: "3m ago",
    dataActivity: [
      400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540,
      550, 560, 570, 580, 590, 600, 610, 620, 630, 640, 650, 660, 670, 680, 690,
    ],
  },
  {
    id: 6,
    device: "Water Level Sensors",
    status: "ONLINE",
    channels: 4,
    dataPoints: 10000,
    fields: 2,
    lastUpdated: "10m ago",
    dataActivity: [
      200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250, 255, 260, 265, 270,
      275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345,
    ],
  },
  {
    id: 7,
    device: "Air Quality Monitoring",
    status: "ONLINE",
    channels: 6,
    dataPoints: 15000,
    fields: 5,
    lastUpdated: "4m ago",
    dataActivity: [
      350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
      500, 510, 520, 530, 540, 550, 560, 570, 580, 590, 600, 610, 620, 630, 640,
    ],
  },
  {
    id: 8,
    device: "Solar Panel Output",
    status: "ONLINE",
    channels: 8,
    dataPoints: 20000,
    fields: 3,
    lastUpdated: "2m ago",
    dataActivity: [
      600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840, 860, 880,
      900, 920, 940, 960, 980, 1000, 1020, 1040, 1060, 1080, 1100, 1120, 1140,
      1160, 1180,
    ],
  },
  {
    id: 9,
    device: "GPS Tracking",
    status: "ONLINE",
    channels: 12,
    dataPoints: 30000,
    fields: 4,
    lastUpdated: "30s ago",
    dataActivity: [
      800, 820, 840, 860, 880, 900, 920, 940, 960, 980, 1000, 1020, 1040, 1060,
      1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220, 1240, 1260, 1280, 1300,
      1320, 1340, 1360, 1380,
    ],
  },
  {
    id: 10,
    device: "Weather Station",
    status: "ONLINE",
    channels: 3,
    dataPoints: 7500,
    fields: 6,
    lastUpdated: "5m ago",
    dataActivity: [
      250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380, 390,
      400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500, 510, 520, 530, 540,
    ],
  },
  {
    id: 11,
    device: "Industrial Machine Monitoring",
    status: "ONLINE",
    channels: 15,
    dataPoints: 37500,
    fields: 10,
    lastUpdated: "1m ago",
    dataActivity: [
      1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550,
      1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150,
      2200, 2250, 2300, 2350, 2400, 2450,
    ],
  },
];
