"use client";

import React, { useState, useEffect } from "react";
import { RoomPermission } from "@liveblocks/node";

import {
  Typography,
  ListItemAvatar,
  ListItemText,
  NativeSelect,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { List, ListItem } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import { UserAccessType } from "@/types";
import {
  updateRoomDefaultAccess,
  getRoomAccess,
} from "@/lib/actions/room.actions";
import { useSession } from "next-auth/react";

const GeneralAccess = ({ roomId }: { roomId: string }) => {
  const [generalAccess, setGeneralAccess] = useState<UserAccessType>("viewer");
  const [linkAccessType, setLinkAccessType] = useState<"restricted" | "anyone">(
    "restricted"
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchRoomAccess = async () => {
      setIsFetching(true);
      try {
        const room = await getRoomAccess({
          roomId,
          userEmail: session!.user!.email,
        }); // You might need to pass the current user's email here
        const defaultAccesses = room.defaultAccesses as RoomPermission;
        if (defaultAccesses.length === 0) {
          setLinkAccessType("restricted");
        }
        if (defaultAccesses.some((access) => access === "room:write")) {
          setLinkAccessType("anyone");
          setGeneralAccess("editor");
        } else if (defaultAccesses.some((access) => access === "room:read")) {
          setLinkAccessType("anyone");
          setGeneralAccess("viewer");
        }
      } catch (error) {
        console.error("Failed to fetch room access:", error);
        setSnackbarMessage("Failed to fetch room access");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setIsFetching(false);
      }
    };

    fetchRoomAccess();
  }, [roomId]);

  const handleGeneralAccessChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (value === "anyone") {
      setLinkAccessType("anyone");
      setGeneralAccess("viewer");
      updateDefaultAccess("viewer");
    } else {
      setLinkAccessType("restricted");
      setGeneralAccess(value as UserAccessType);
      updateDefaultAccess("restricted");
    }
  };

  const updateDefaultAccess = async (
    accessType: "restricted" | "viewer" | "editor"
  ) => {
    setIsLoading(true);
    let defaultAccesses: RoomPermission = [];
    switch (accessType) {
      case "restricted":
        defaultAccesses = [];
        break;
      case "viewer":
        defaultAccesses = ["room:read", "room:presence:write"];
        break;
      case "editor":
        defaultAccesses = ["room:write"];
        break;
    }

    try {
      await updateRoomDefaultAccess(roomId, defaultAccesses);
      setSnackbarMessage("Channel general access updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update channel general access:", error);
      setSnackbarMessage("Failed to update channel general access");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Typography variant="h6">General access</Typography>
      <List>
        <ListItem>
          <ListItemAvatar>
            {linkAccessType === "restricted" ? <LockIcon /> : <PublicIcon />}
          </ListItemAvatar>
          <ListItemText
            primary={
              <NativeSelect
                value={linkAccessType}
                onChange={handleGeneralAccessChange}
                disabled={isLoading}
              >
                <option value="restricted">Restricted</option>
                <option value="anyone">Anyone with the link</option>
              </NativeSelect>
            }
            secondary={
              <Typography gutterBottom variant="h6">
                {linkAccessType === "restricted"
                  ? "Only people with access can open with the link"
                  : `Anyone on the internet with the link can
                ${generalAccess === "viewer" ? "view" : "edit"}`}
              </Typography>
            }
          />
          {linkAccessType === "anyone" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NativeSelect
                value={generalAccess}
                onChange={(event) => {
                  setGeneralAccess(event.target.value as UserAccessType);
                  updateDefaultAccess(
                    event.target.value as "viewer" | "editor"
                  );
                }}
                sx={{ ml: 3, mt: 2 }}
                disabled={isLoading}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </NativeSelect>
              {isLoading && <CircularProgress size={24} sx={{ ml: 2 }} />}
            </Box>
          )}
        </ListItem>
      </List>
    </>
  );
};

export default GeneralAccess;
