"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import {
  AccessType,
  CreateChannelRoomParams,
  RoomAccesses,
  ShareDocumentParams,
} from "@/types";
import axios from "axios";

export const createChannelRoom = async ({
  roomId,
  userId,
  email,
  title,
}: CreateChannelRoomParams) => {
  try {
    const metadata = {
      creatorId: userId,
      email,
      title,
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"],
    });

    revalidatePath("/dashboard/channels");

    return parseStringify(room);
  } catch (error) {
    return;
  }
};

export const getRoomAccess = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You do not have access to this channel");
    }

    return parseStringify(room);
  } catch (error) {
    console.error("Error getting room access", error);
    throw new Error(error as string);
  }
};

export const updateChannelRoomData = async (
  channelId: string,
  title: string
) => {
  try {
    const response = await axios.patch(`/api/channels/${channelId}`, {
      name: title,
    });

    console.log("response", response);

    if (response.status !== 200) {
      return null;
    }

    const updateChannelRoom = await liveblocks.updateRoom(channelId, {
      metadata: {
        title,
      },
    });

    console.log("updateChannelRoom", updateChannelRoom);

    revalidatePath(`/dashboard/channels/${channelId}`);

    return parseStringify(updateChannelRoom);
  } catch (error) {
    return null;
  }
};

export const updateChannelAccess = async ({
  roomId,
  channelId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    if (room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the channel by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          image: updatedBy.avatar,
          email: updatedBy.email,
        },
        roomId: channelId,
      });
    }

    revalidatePath(`/dashboard/channels/${channelId}`);
    return parseStringify(room);
  } catch (error) {
    return null;
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    if (room.metadata.email === email) {
      throw new Error("You cannot remove yourself from the document");
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });

    revalidatePath(`/dashboard/channels/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    return null;
  }
};

export const deleteChannel = async (channelId: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelId}`
    );

    if (response.status !== 200) {
      return null;
    }

    await liveblocks.deleteRoom(channelId);

    revalidatePath("/dashboard/channels");
    return parseStringify(response.data);
  } catch (error) {
    console.error("Error deleting channel:", error);
    revalidatePath("/dashboard/channels");
  }
};
