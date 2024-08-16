"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUsers, getDocumentUsers } from "@/lib/actions/user.actions";

const CollaborationProvider = ({ children }: { children: ReactNode }) => {
  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    redirect("/login");
  }

  if (!session || !session.user) {
    return null;
  }

  const userId = session.user.id;

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getUsers({ userIds });

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          userId,
          text,
        });

        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default CollaborationProvider;
