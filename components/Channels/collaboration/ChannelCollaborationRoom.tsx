"use client";

import React from "react";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import { ChannelCollaborativeRoomProps } from "@/types";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import ChannelDetailsHeading from "../ChannelDetailsHeading";
import ChannelNavigation from "../ChannelNavigation";
import ChannelCollaborationEditor from "@/components/Channels/collaboration/ChannelCollaborationEditor";

const ChannelCollaborationRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
  channel,
  dataPoint,
  fields,
  sampleCodes,
  apiKey,
}: ChannelCollaborativeRoomProps) => {
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<LoadingProgressBar />}>
        <div className="flex flex-col">
          <ChannelDetailsHeading
            roomId={roomId}
            users={users}
            roomMetadata={roomMetadata}
            currentUserType={currentUserType}
            channel={channel}
            dataPoint={dataPoint}
          />
          <ChannelNavigation
            channelId={channel.id}
            fields={fields}
            dataPoint={dataPoint}
            sampleCodes={sampleCodes}
            apiKey={apiKey}
          />
          <ChannelCollaborationEditor
            roomId={roomId}
            currentUserType={currentUserType}
            channelDescription={channel.description}
          />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default ChannelCollaborationRoom;
