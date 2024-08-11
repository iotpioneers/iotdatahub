"use client";

import React, { useState } from "react";
import { useSelf } from "@liveblocks/react/suspense";
import Button from "@mui/material/Button";
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
import FormControl from "@mui/material/FormControl";
import { ShareDocumentDialogProps, UserType } from "@/types";
import { User } from "@/types/user";
import { Share } from "@phosphor-icons/react";
import { updateChannelAccess } from "@/lib/actions/room.actions";
import Collaborator from "./Collaborator";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const InviteMember = ({
  roomId,
  collaborators,
  creator,
  currentUserType,
}: ShareDocumentDialogProps) => {
  const user = useSelf();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("viewer");
  const [showResult, setShowResult] = useState<boolean>(false);

  const accessChangeHandler = (
    event: SelectChangeEvent<"creator" | "editor" | "viewer">
  ) => {
    setUserType(event.target.value as UserType);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

  const shareChannelHandler = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !roomId || !userType || !user) {
      setError("Please enter all fields");
      setLoading(false);
      setShowResult(true);
      return;
    }

    try {
      await updateChannelAccess({
        roomId,
        email,
        userType: userType as UserType,
        updatedBy: user.info,
      });

      setSuccess("User has been invited successfully");
      setShowResult(true);
    } catch (error) {
      setError("Failed to invite user");
      setShowResult(true);
      setOpen(false);
    } finally {
      setLoading(false);
      setOpen(false);
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
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Manage who can view this project
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          <Typography gutterBottom>
            Select which users can view and edit this document
          </Typography>
          <div className="flex justify-between items-center mt-5">
            <TextField
              autoFocus
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
                <MenuItem value="commenter">comment</MenuItem>
                <MenuItem value="editor">edit</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              onClick={shareChannelHandler}
              className=" text-white gradient-blue flex h-full gap-1 px-5"
              disabled={loading}
            >
              {loading ? "Sending..." : "Invite"}
            </Button>
          </div>
          <div className="my-2 space-y-2">
            <ul className="flex flex-col">
              {collaborators.map((collaborator) => (
                <Collaborator
                  key={collaborator.id}
                  roomId={roomId}
                  creator={creator}
                  email={collaborator.email}
                  collaborator={collaborator}
                  user={user.info as User}
                />
              ))}
            </ul>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default InviteMember;
