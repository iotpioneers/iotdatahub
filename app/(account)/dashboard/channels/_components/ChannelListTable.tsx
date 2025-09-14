"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import Link from "next/link";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Chip, Avatar, Typography, Button } from "@mui/material";
import { Channel } from "@/types";
import axios from "axios";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { ActionModal } from "@/components/dashboard/ActionModal";
import { useSession } from "next-auth/react";
import { deleteChannel } from "@/lib/actions/room.actions";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(date));

const ChannelListTable = ({
  initialChannels,
}: {
  initialChannels: Channel[] | [];
}) => {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    return null;
  }

  const email = session!.user!.email;

  const fetchChannels = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels`,
      );
      if (response.status === 200) {
        setChannels(response.data);
      }
    } catch (error) {
      setError("Failed to fetch updated channel data");
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels, updateTrigger]);

  const updateChannelAccess = async (channelId: string, newAccess: string) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelId}`,
        {
          access: newAccess,
        },
      );

      if (response.status !== 200) {
        setError(response.data.message);
        setShowMessage(true);
        return;
      }

      setInfo("Channel access updated successfully");
      setShowMessage(true);
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      setError("Failed to update channel access");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    setLoading(true);
  };

  const renderAccessBadge = (params: GridRenderCellParams) => {
    const channel = params.row;
    const access = params.value;
    let color: "default" | "success" | "warning" = "default";
    let label = "Unknown";

    switch (access) {
      case "PUBLIC":
        color = "warning";
        label = "Public";
        break;
      case "PRIVATE":
        color = "success";
        label = "Private";
        break;
      default:
        break;
    }

    const newAccess = access === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    const newLabel = newAccess === "PUBLIC" ? "Public" : "Private";

    return (
      <ActionModal
        triggerComponent={
          <Chip
            label={label}
            color={color}
            variant="filled"
            size="small"
            className="cursor-pointer"
          />
        }
        title={`Change Access to ${newLabel}`}
        description={`Are you sure you want to change the access of "${channel.name}" to ${newLabel}?`}
        confirmButtonText="Change Access"
        onConfirm={() => updateChannelAccess(channel.id, newAccess)}
        iconSrc="/icons/edit.svg"
      />
    );
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Channel",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center mt-1 gap-1">
          <img src="/icons/justify.svg" alt="channel" className="w-6 h-6"></img>
          <Link
            href={`/dashboard/channels/${params.row.id}`}
            className="text-blue-500 hover:underline"
            onClick={handleLinkClick}
          >
            {params.value}
          </Link>
        </div>
      ),
    },
    {
      field: "owner",
      headerName: "Owner",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <div className="flex items-center mt-1 gap-1">
          <Avatar src={params.row.ownerImage} alt={params.row.ownerEmail}>
            {params.row.ownerEmail[0].toUpperCase()}
          </Avatar>
          <Typography variant="body2">
            {email && email === params.row.ownerEmail
              ? "Me"
              : params.row.ownerEmail}
          </Typography>
        </div>
      ),
    },
    {
      field: "access",
      headerName: "Access",
      width: 120,
      renderCell: renderAccessBadge,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 280,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 2 }}>
          {formatDate(params.value)}
        </Typography>
      ),
    },
    {
      field: "Action Button",
      headerName: "",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <ActionModal
          triggerComponent={
            <Button variant="contained" size="small" color="error">
              Delete
            </Button>
          }
          title="Delete Channel"
          description={`Are you sure you want to delete the channel "${params.row.name}"?`}
          confirmButtonText="Delete"
          onConfirm={() => deleteChannel(params.row.id)}
          iconSrc="/icons/delete.svg"
        />
      ),
    },
  ];

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowMessage(false);
  };

  if (!channels || channels.length === 0) {
    return <LoadingProgressBar />;
  }

  return (
    <div style={{ height: 600, width: "100%" }}>
      {loading && <LoadingProgressBar />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error ? error : info}
        </Alert>
      </Snackbar>

      <DataGrid
        rows={channels}
        columns={columns}
        getRowId={(row) => row.id}
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
    </div>
  );
};

export default ChannelListTable;
