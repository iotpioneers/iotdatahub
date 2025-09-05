"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import type { ChannelCollaborativeRoomProps } from "@/types";
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
  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<LoadingProgressBar />}>
        <div className="flex flex-col h-full space-y-4">
          <div className="flex-shrink-0">
            <ChannelDetailsHeading
              roomId={roomId}
              roomMetadata={roomMetadata}
              currentUserType={currentUserType}
              channel={channel}
              dataPoint={dataPoint}
            />
          </div>
          <div className="flex-shrink-0">
            <ChannelNavigation
              channelId={roomId}
              channel={channel}
              fields={fields}
              dataPoint={dataPoint}
              apiKey={apiKey}
              currentUserType={currentUserType}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelCollaborationEditor currentUserType={currentUserType} />
          </div>
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default ChannelCollaborationRoom;
