"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getUsersByEmails, getDocumentUsers } from "@/lib/actions/user.actions";

const Provider = ({ children }: { children: ReactNode }) => {
  const { status, data: session } = useSession();

  if (status === "unauthenticated") redirect("/login");

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getUsersByEmails({ userIds });

        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: session!.user!.email!,
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

export default Provider;
