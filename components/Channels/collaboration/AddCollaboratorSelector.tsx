"use client";

import React, { useState, useEffect } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { UserData } from "@/types/user";
import { UserAccessType } from "@/types";
import { updateChannelAccess } from "@/lib/actions/room.actions";

interface Collaborator {
  id: string;
  email: string;
  name?: string;
  image: string | null;
  accessType: "Editor" | "Viewer";
}

interface AddCollaboratorSelectorProps {
  roomId: string;
  onCollaboratorsAdded: () => void;
}

const AddCollaboratorSelector: React.FC<AddCollaboratorSelectorProps> = ({
  roomId,
  onCollaboratorsAdded,
}) => {
  const user = useSelf();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCollaborators, setSelectedCollaborators] = useState<
    Collaborator[]
  >([]);
  const [notifyPeople, setNotifyPeople] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [noUserFound, setNoUserFound] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
      );

      if (response.status === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setNoUserFound(false);
  };

  const handleAddCollaborator = (user: UserData) => {
    setSelectedCollaborators((prev) => [
      ...prev,
      {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        accessType: "Viewer",
      },
    ]);
    setSearchTerm("");
    setNoUserFound(false);
  };

  const handleRemoveCollaborator = (id: string) => {
    setSelectedCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAccessTypeChange = (
    id: string,
    event: SelectChangeEvent<"Editor" | "Viewer">
  ) => {
    setSelectedCollaborators((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, accessType: event.target.value as "Editor" | "Viewer" }
          : c
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      !selectedCollaborators.some(
        (collaborator) => collaborator.id === user.id
      ) &&
      (user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name &&
          user.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  useEffect(() => {
    if (searchTerm && filteredUsers.length === 0) {
      setNoUserFound(true);
    } else {
      setNoUserFound(false);
    }
  }, [searchTerm, filteredUsers]);

  const handleInviteCollaborators = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (selectedCollaborators.length === 0 || !roomId || !user) {
      setError("Please select at least one collaborator");
      setLoading(false);
      setShowResult(true);
      return;
    }

    try {
      const collaborators = selectedCollaborators.map((collaborator) => ({
        email: collaborator.email,
        userType: collaborator.accessType.toLowerCase() as UserAccessType,
      }));

      const response = await updateChannelAccess({
        roomId,
        collaborators,
        notifyPeople,
        message,
        updatedBy: user.info,
      });

      if (response) {
        setSuccess(
          "Collaborators have been invited to the channel successfully"
        );
        setSelectedCollaborators([]);
        setMessage("");
        onCollaboratorsAdded(); // Call this to refresh the collaborator list
      } else {
        setError("Failed to invite collaborators");
      }
    } catch (error) {
      console.error("Error inviting collaborators:", error);
      setError("Failed to invite collaborators");
    } finally {
      setLoading(false);
      setShowResult(true);
    }
  };
  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowResult(false);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 450 }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showResult}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success ? success : error}
        </Alert>
      </Snackbar>
      <Paper sx={{ mb: 2, color: "black" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {selectedCollaborators.map((collaborator) => (
            <Box key={collaborator.id}>
              <Chip
                avatar={
                  <Avatar src={collaborator.image || undefined}>
                    {collaborator.name?.[0] || collaborator.email[0]}
                  </Avatar>
                }
                label={collaborator.name || collaborator.email}
                onDelete={() => handleRemoveCollaborator(collaborator.id)}
                deleteIcon={<CloseIcon />}
                sx={{ color: "black", mr: 1 }}
              />
              <Select
                value={collaborator.accessType}
                onChange={(event) =>
                  handleAccessTypeChange(collaborator.id, event)
                }
                size="small"
                sx={{
                  minWidth: 100,
                  height: 32,
                  color: "black",
                }}
              >
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </Box>
          ))}
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Add people, groups, ..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            mb: 2,
            borderRadius: 1,
            "& .MuiOutlinedInput-root": { color: "black" },
          }}
        />
        {searchTerm && (
          <List sx={{ color: "black" }}>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                button
                onClick={() => handleAddCollaborator(user)}
              >
                <ListItemAvatar>
                  <Avatar src={user.image || undefined}>
                    {user.name?.[0] || user.email[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name || user.email}
                  secondary={user.name ? user.email : null}
                />
              </ListItem>
            ))}
          </List>
        )}
        {noUserFound && searchTerm && (
          <Typography color="error" sx={{ mt: 1 }}>
            User not found
          </Typography>
        )}
        {selectedCollaborators.length > 0 && (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={notifyPeople}
                  onChange={(e) => setNotifyPeople(e.target.checked)}
                  sx={{ color: "black" }}
                />
              }
              label="Notify people"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                mt: 2,
                borderRadius: 1,
                "& .MuiOutlinedInput-root": { color: "black" },
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => setSelectedCollaborators([])}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleInviteCollaborators}
                disabled={loading}
              >
                {loading ? "Inviting..." : "Invite"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AddCollaboratorSelector;
