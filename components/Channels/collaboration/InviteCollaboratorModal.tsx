"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ShareChannelRoomAccessDialogProps, User } from "@/types";
import { CollaborationUser } from "@/types/user";
import { Share, Link } from "@phosphor-icons/react";
import PeopleWithAccess from "./PeopleWithAccess";
import GeneralAccess from "./GeneralAccess";
import { CheckCircle } from "lucide-react";
import AddCollaboratorSelector from "./AddCollaboratorSelector";
import { getUsers } from "@/lib/actions/user.actions";
import { getRoomAccess } from "@/lib/actions/room.actions";
import { useSession } from "next-auth/react";
import LoadingProgressBar from "@/components/LoadingProgressBar";

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
  creator,
  currentUserType,
}: ShareChannelRoomAccessDialogProps & {}) => {
  const user = useSelf();
  const { data: session } = useSession();

  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [collaboratorList, setCollaboratorList] = useState<User[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const copyLinkToClipboard = useCallback(() => {
    navigator.clipboard
      .writeText(
        `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${roomId}`
      )
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 5000);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        setError("Failed to copy link");
        setShowResult(true);
      });
  }, [roomId]);

  const handleCollaboratorRemoved = (removedEmail: string) => {
    setCollaboratorList((prevCollaborators) =>
      prevCollaborators.filter(
        (collaborator) => collaborator.email !== removedEmail
      )
    );
  };

  const fetchCollaborators = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setError("");

    const userEmail = session.user.email;

    try {
      const roomData = await getRoomAccess({
        roomId,
        userEmail,
      });

      if (!roomData) {
        setError("You do not have access to this channel");
        return;
      }

      const userIds = Object.keys(roomData.usersAccesses);

      const users = await getUsers({ userIds });

      if (!users || users.length === 0) {
        setError("No collaborators found or an error occurred");
        return;
      }

      const collaboratorsData = users.map((user: CollaborationUser) => ({
        ...user,
        userType: roomData.usersAccesses[user.email]?.includes("room:write")
          ? "editor"
          : "viewer",
      }));

      setCollaboratorList(collaboratorsData);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setError("Failed to fetch collaborators");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (openInviteModal) {
      fetchCollaborators();
    }
  }, [openInviteModal, session, roomId]);

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showResult}
        autoHideDuration={6000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
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
        fullWidth
        maxWidth="md"
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
          <AddCollaboratorSelector
            roomId={roomId}
            onCollaboratorsAdded={fetchCollaborators}
          />

          <div className="my-2 space-y-2">
            <Typography gutterBottom variant="h4" mt={2}>
              People with access
            </Typography>
            {isLoading ? (
              <LoadingProgressBar />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : collaboratorList.length === 0 ? (
              <Typography>No collaborators found</Typography>
            ) : (
              <ul className="flex flex-col">
                {collaboratorList.map((collaborator) => (
                  <PeopleWithAccess
                    key={collaborator.id}
                    roomId={roomId}
                    creator={creator}
                    receiverEmail={collaborator.email}
                    collaborator={collaborator}
                    user={user.info as CollaborationUser}
                    onCollaboratorRemoved={handleCollaboratorRemoved}
                  />
                ))}
              </ul>
            )}
          </div>
          <div className="my-2 space-y-2">
            <GeneralAccess roomId={roomId} />
          </div>
          <DialogActions sx={{ justifyContent: "space-between" }}>
            <Button
              startIcon={linkCopied ? <CheckCircle /> : <Link />}
              variant="outlined"
              onClick={copyLinkToClipboard}
            >
              {linkCopied ? "Link Copied!" : "Copy link"}
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
