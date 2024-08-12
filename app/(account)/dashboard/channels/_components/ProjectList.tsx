import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link"; // Import Link from Next.js
import { DeleteChannelModal } from "@/components/Channels/collaboration/DeleteChannelModal";
import { ChannelProps } from "@/types";

const ProjectList = ({ channels }: { channels: ChannelProps[] | [] }) => {
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
        <DeleteChannelModal channelId={params.row.id} />
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
