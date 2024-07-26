"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link"; // Import Link from Next.js

interface Channel {
  id: string;
  name: string;
  description: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const ProjectList = () => {
  const [channels, setChannels] = useState<Channel[] | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/channels");
        if (!res.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.json();

        // Assuming createdAt in channelsData is a string, parse it into Date
        channelsData.forEach((channel) => {
          channel.createdAt = new Date(channel.createdAt);
        });

        setChannels(channelsData);
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Handle error state or retry logic if needed
      }
    };

    fetchChannels();
  }, []);

  if (channels === null || channels.length === 0) {
    return null;
  }

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Channel",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/dashboard/channels/${params.row.id}`}>
          {params.value}
        </Link>
      ),
    },
    { field: "description", headerName: "Description", width: 300 },
    { field: "latitude", headerName: "Latitude", width: 150 },
    { field: "longitude", headerName: "Longitude", width: 150 },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={channels}
        columns={columns}
        getRowId={(row) => row.id}
        pagination
        autoPageSize
      />
    </div>
  );
};

export default ProjectList;
