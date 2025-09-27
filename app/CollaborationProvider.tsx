"use client";

import { ReactNode, useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { getUsers, getChannelRoomUsers } from "@/lib/actions/UserActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SessionModal from "@/components/Actions/SessionModal";
import { LinearLoading } from "@/components/LinearLoading";

const CollaborationProvider = ({ children }: { children: ReactNode }) => {
  const { status, data: session } = useSession();

  // States
  const [users, setUsers] = useState([]);
  const [channelRoomUsers, setChannelRoomUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Snackbar and Alert management
  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (status === "loading") {
    return <LinearLoading />;
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <SessionModal
        open={true}
        type="session"
        onRefresh={() => window.location.reload()}
        onLogin={() => signIn()}
      />
    );
  }

  const userEmail = session.user.email;

  // Functions to fetch data with loading and error handling
  const fetchUsers = async (userIds: string[]) => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers({ userIds });
      setUsers(fetchedUsers);
    } catch (error) {
      setAlertMessage("Error fetching users");
      setAlertSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelRoomUsers = async (roomId: string, text: string) => {
    setLoading(true);
    try {
      const fetchedChannelRoomUsers = await getChannelRoomUsers({
        roomId,
        userEmail,
        text,
      });
      setChannelRoomUsers(fetchedChannelRoomUsers);
    } catch (error) {
      setAlertMessage("Error fetching channel room users");
      setAlertSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        await fetchUsers(userIds);
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        await fetchChannelRoomUsers(roomId, text);
        return channelRoomUsers;
      }}
    >
      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Loading Spinner when fetching data */}
      {loading ? (
        <LinearLoading />
      ) : (
        <ClientSideSuspense fallback={<LinearLoading />}>
          {children}
        </ClientSideSuspense>
      )}
    </LiveblocksProvider>
  );
};

export default CollaborationProvider;
