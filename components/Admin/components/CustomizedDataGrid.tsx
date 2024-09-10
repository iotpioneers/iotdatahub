import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { DataPoint, Organization } from "@/types";
import { dateConverter } from "@/lib/utils";
import LoadingProgressBar from "@/components/LoadingProgressBar";

// Custom hook for fetching organization data
function useOrganizationData() {
  const [rows, setRows] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/organizations`
        );
        const data = response.data;

        const OrganizationsData = data.map((org: any) => {
          const dataPoints: DataPoint[] = org.DataPoint || [];
          const sortedDataPoints = dataPoints.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          const lastUploaded =
            sortedDataPoints.length > 0
              ? dateConverter(sortedDataPoints[0].timestamp).toLocaleString()
              : "";

          const dataActivity = calculateDataActivity(sortedDataPoints);

          return {
            id: org.id,
            name: org.name,
            memberCount: org.members.length,
            deviceCount: org.Device.length,
            channelCount: org.Channel.length,
            fieldCount: org.Field.length,
            dataPointCount: dataPoints.length,
            lastUploaded,
            dataActivity,
          };
        });

        setRows(OrganizationsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { rows, loading, error };
}

function calculateDataActivity(
  dataPoints: DataPoint[]
): { value: number; date: Date }[] {
  // Group data points by day for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activityByDay: { [key: string]: { value: number; date: Date } } = {};
  for (let i = 0; i < 30; i++) {
    const day = new Date(thirtyDaysAgo);
    day.setDate(day.getDate() + i);
    const dateString = day.toISOString().split("T")[0];
    activityByDay[dateString] = { value: 0, date: day };
  }

  dataPoints.forEach((point) => {
    const day = new Date(point.timestamp).toISOString().split("T")[0];
    if (activityByDay[day]) {
      activityByDay[day].value++;
    }
  });

  return Object.values(activityByDay);
}

function renderSparklineCell(
  params: GridRenderCellParams<any, { value: number; date: Date }[]>
) {
  const value = params.value;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value.map((item) => item.value)}
        width={150}
        height={32}
        plotType="bar"
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
        valueFormatter={(chartValue: number | null) => {
          if (chartValue === null) return "";
          const index = chartValue as number;
          if (index < 0 || index >= value.length) return chartValue.toString();
          const date = value[index].date;
          return `${date.toLocaleString("default", {
            month: "short",
          })} ${date.getDate()}: ${value[index].value}`;
        }}
      />
    </div>
  );
}

// Column definitions
const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Organization",
    flex: 1,
    width: 230,
    minWidth: 200,
  },
  { field: "memberCount", headerName: "Members", type: "number", width: 130 },
  { field: "deviceCount", headerName: "Devices", type: "number", width: 130 },
  { field: "channelCount", headerName: "Channels", type: "number", width: 130 },
  { field: "fieldCount", headerName: "Fields", type: "number", width: 130 },
  {
    field: "dataPointCount",
    headerName: "Data Points",
    type: "number",
    width: 130,
  },
  {
    field: "lastUploaded",
    headerName: "Last Uploaded",
    width: 180,
  },
  {
    field: "dataActivity",
    headerName: "Data Activity",
    width: 200,
    renderCell: renderSparklineCell,
  },
];

export default function OrganizationDataGrid() {
  const { rows, loading, error } = useOrganizationData();

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {loading ? (
        <LoadingProgressBar />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      )}
    </div>
  );
}
