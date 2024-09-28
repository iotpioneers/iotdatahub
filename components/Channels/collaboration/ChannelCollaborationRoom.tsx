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
  currentUserType,
  channel,
  dataPoint,
  fields,
  apiKey,
}: ChannelCollaborativeRoomProps) => {
  console.log("Channel", channel);
  console.log("Channel", channel);
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<LoadingProgressBar />}>
        <div className="flex flex-col">
          <ChannelDetailsHeading
            roomId={roomId}
            roomMetadata={roomMetadata}
            currentUserType={currentUserType}
            channel={channel}
            dataPoint={dataPoint}
          />
          <ChannelNavigation
            channelId={roomId}
            channel={channel}
            fields={fields}
            dataPoint={dataPoint}
            apiKey={apiKey}
            currentUserType={currentUserType}
          />
          <ChannelCollaborationEditor currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default ChannelCollaborationRoom;
