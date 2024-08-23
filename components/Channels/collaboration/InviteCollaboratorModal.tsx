"use client";

import React, { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import { styled } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { ShareChannelRoomAccessDialogProps, UserAccessType } from "@/types";
import { CollaborationUser } from "@/types/user";
import { Share, Link } from "@phosphor-icons/react";
import { updateChannelAccess } from "@/lib/actions/room.actions";
import Collaborator from "./Collaborator";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import NativeSelect from "@mui/material/NativeSelect";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const InviteCollaboratorModal = ({
  roomId,
  collaborators,
  creator,
  currentUserType,
  initialGeneralAccess = "viewer",
}: ShareChannelRoomAccessDialogProps & {
  initialGeneralAccess?: UserAccessType;
}) => {
  const user = useSelf();

  const [openInviteModal, setOpenInviteModal] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserAccessType>("viewer");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [generalAccess, setGeneralAccess] =
    useState<UserAccessType>(initialGeneralAccess);
  const [linkAccessType, setLinkAccessType] = useState<"restricted" | "anyone">(
    "restricted"
  );

  const accessChangeHandler = (
    event: SelectChangeEvent<"creator" | "editor" | "viewer">
  ) => {
    setUserType(event.target.value as UserAccessType);
  };

  const handleGeneralAccessChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (value === "anyone") {
      setLinkAccessType("anyone");
      setGeneralAccess("viewer");
    } else {
      setLinkAccessType("restricted");
      setGeneralAccess(value as UserAccessType);
    }
  };

  const handleClickOpen = () => {
    setOpenInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setOpenInviteModal(false);
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

  const shareChannelAccessHandler = async () => {
    setLoading(true);

    if (!email || !roomId || !userType || !user) {
      setError("Please enter all fields");
      setLoading(false);
      setShowResult(true);
      return;
    }

    try {
      await updateChannelAccess({
        roomId,
        receiverEmail: email,
        userType: userType as UserAccessType,
        updatedBy: user.info,
      });

      setSuccess(
        "User has been invited to collaborate on the channel successfully"
      );
      setShowResult(true);
    } catch (error) {
      setError("Failed to invite user");
      setShowResult(true);
      setOpenInviteModal(false);
    } finally {
      setLoading(false);
      setOpenInviteModal(false);
      setEmail("");
      setUserType("viewer");
    }
  };

  return (
    <React.Fragment>
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
      {currentUserType === "editor" && (
        <Button variant="outlined" onClick={handleClickOpen}>
          <Share className="mr-1" />
          <p className="mr-1 block">Share</p>
        </Button>
      )}
      <BootstrapDialog
        onClose={handleCloseInviteModal}
        aria-labelledby="customized-dialog-title"
        open={openInviteModal}
      >
        <DialogTitle
          variant="h3"
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
        >
          Invite Collaborator
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseInviteModal}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="flex justify-between items-center mt-2">
            <TextField
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              placeholder="Enter email address"
            />
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Access</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={userType}
                label="Access"
                onChange={accessChangeHandler}
              >
                <MenuItem value="viewer">view</MenuItem>
                <MenuItem value="editor">edit</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              onClick={shareChannelAccessHandler}
              className=" text-white gradient-blue flex h-full gap-1 px-5"
              disabled={loading}
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
          <div className="my-2 space-y-2">
            <Typography gutterBottom variant="h4" mt={2}>
              People with access
            </Typography>
            <ul className="flex flex-col">
              {collaborators.map((collaborator) => (
                <Collaborator
                  key={collaborator.id}
                  roomId={roomId}
                  creator={creator}
                  receiverEmail={collaborator.email}
                  collaborator={collaborator}
                  user={user.info as CollaborationUser}
                />
              ))}
            </ul>
          </div>
          <div className="my-2 space-y-2">
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              General access
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    {linkAccessType === "restricted" ? (
                      <LockIcon />
                    ) : (
                      <PublicIcon />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <NativeSelect
                      defaultValue="restricted"
                      inputProps={{
                        name: "generalAccess",
                        id: "uncontrolled-native",
                      }}
                      onChange={handleGeneralAccessChange}
                    >
                      <option value="restricted">Restricted</option>
                      <option value="anyone">Anyone with the link</option>
                    </NativeSelect>
                  }
                  secondary={
                    linkAccessType === "restricted"
                      ? "Only people with access can open with the link"
                      : `Anyone on the internet with the link can ${
                          generalAccess === "viewer" ? "view" : "edit"
                        } `
                  }
                />
                {linkAccessType === "anyone" && (
                  <NativeSelect
                    defaultValue="viewer"
                    inputProps={{
                      name: "linkAccessType",
                      id: "uncontrolled-native",
                    }}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      setGeneralAccess(event.target.value as UserAccessType)
                    }
                    sx={{ ml: 3, mt: 2 }}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </NativeSelect>
                )}
              </ListItem>
            </List>
          </div>
          <DialogActions sx={{ justifyContent: "space-between" }}>
            <Button startIcon={<Link />} variant="outlined">
              Copy link
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseInviteModal}
            >
              Done
            </Button>
          </DialogActions>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default InviteCollaboratorModal;
