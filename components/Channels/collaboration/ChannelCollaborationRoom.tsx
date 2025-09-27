"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import type { ChannelCollaborativeRoomProps } from "@/types";
import ChannelDetailsHeading from "../ChannelDetailsHeading";
import ChannelNavigation from "../ChannelNavigation";
import ChannelCollaborationEditor from "@/components/Channels/collaboration/ChannelCollaborationEditor";
import { LinearLoading } from "@/components/LinearLoading";

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
            <ChannelDetailsHeading
              roomId={roomId}
              roomMetadata={roomMetadata}
              currentUserType={currentUserType}
              channel={channel}
              dataPoint={dataPoint}
            />
          </div>
          <div>
            <ChannelNavigation
              channelId={roomId}
              channel={channel}
              fields={fields}
              dataPoint={dataPoint}
              apiKey={apiKey}
              currentUserType={currentUserType}
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
