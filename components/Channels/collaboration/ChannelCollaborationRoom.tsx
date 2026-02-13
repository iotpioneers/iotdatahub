"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import type { ChannelCollaborativeRoomProps } from "@/types";
import ChannelCollaborationEditor from "@/components/Channels/collaboration/ChannelCollaborationEditor";
import { LinearLoading } from "@/components/LinearLoading";
import ChannelDetailsDataPoints from "@/components/Channels/datapoints/ChannelDetailsDataPoints";

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
      <ClientSideSuspense fallback={<LinearLoading />}>
        <div className="w-full overflow-x-hidden">
          <div>
            <ChannelDetailsDataPoints
              roomId={roomId}
              roomMetadata={roomMetadata}
              currentUserType={currentUserType}
              channel={channel}
              dataPoint={dataPoint}
            />
          </div>
          <div>
            <ChannelCollaborationEditor currentUserType={currentUserType} />
          </div>
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default ChannelCollaborationRoom;
