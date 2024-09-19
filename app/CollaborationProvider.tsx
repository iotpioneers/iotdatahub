"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUsers, getChannelRoomUsers } from "@/lib/actions/user.actions";

const CollaborationProvider = ({ children }: { children: ReactNode }) => {
  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    return null;
  }

  if (!session || !session.user) {
    return null;
  }

  const userEmail = session.user.email;

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getUsers({ userIds });

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const channelRoomUsers = await getChannelRoomUsers({
          roomId,
          userEmail,
          text,
        });

        return channelRoomUsers;
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default CollaborationProvider;
