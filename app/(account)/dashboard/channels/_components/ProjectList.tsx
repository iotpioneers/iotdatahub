"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link"; // Import Link from Next.js
import { DeleteModal } from "@/components/DeleteModal";

interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

const ProjectList = () => {
  const [channels, setChannels] = useState<Channel[] | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/channels"
        );
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
        return null;
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
        <Link
          href={`/dashboard/channels/${params.row.id}`}
          className="text-blue-500 hover:underline"
        >
          {params.value}
        </Link>
      ),
    },
    { field: "description", headerName: "Description", width: 300 },
    { field: "createdAt", headerName: "Created", width: 150 },
    {
      field: "action",
      headerName: "",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <DeleteModal roomId={params.row.id} />
      ),
    },
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
