"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import {
  ChannelAccessType,
  CreateChannelRoomParams,
  RoomAccesses,
  ShareChannelParams,
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
      defaultAccesses: [],
    });

    // Notification for creating a new channel
    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: email,
      kind: "$channelCreated",
      subjectId: notificationId,
      activityData: {
        title: `You have successfully created the channel "${title}"`,
        channelId: roomId,
      },
      roomId,
    });

    revalidatePath("/dashboard/channels");

    return parseStringify(room);
  } catch (error) {
    return;
  }
};

export const getRoomAccess = async ({
  roomId,
  userEmail,
}: {
  roomId: string;
  userEmail: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userEmail);

    if (!hasAccess) {
      throw new Error("You do not have access to this channel");
    }

    return parseStringify(room);
  } catch (error) {
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

    if (response.status !== 200) {
      return null;
    }

    const updateChannelRoom = await liveblocks.updateRoom(channelId, {
      metadata: {
        title,
      },
    });

    const creatorId = Array.isArray(updateChannelRoom.metadata.creatorId)
      ? updateChannelRoom.metadata.creatorId[0]
      : updateChannelRoom.metadata.creatorId;

    // Notification for updating channel information
    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: creatorId,
      kind: "$channelUpdated",
      subjectId: notificationId,
      activityData: {
        title: `The channel "${title}" has been updated`,
        channelId: channelId,
      },
      roomId: channelId,
    });

    revalidatePath(`/dashboard/channels/${channelId}`);

    return parseStringify(updateChannelRoom);
  } catch (error) {
    return null;
  }
};

export const updateChannelAccess = async ({
  roomId,
  receiverEmail,
  userType,
  updatedBy,
}: ShareChannelParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [receiverEmail]: getAccessType(userType) as ChannelAccessType,
    };

    console.log("userType", userType);

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    if (!room) {
      throw new Error("Error updating room access");
    }

    // Notification for updating channel access
    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: receiverEmail,
      kind: "$channelRoomAccess",
      subjectId: notificationId,
      activityData: {
        userType,
        title: `You have been granted ${userType} access to the channel "${room.metadata.title}"`,
        updatedBy: updatedBy.name,
        image: updatedBy.avatar,
        email: updatedBy.email,
        channelId: roomId,
      },
      roomId,
    });

    revalidatePath(`/dashboard/channels/${roomId}`);
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

    // Notification for removing a collaborator
    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: email,
      kind: "$channelRoomAccess",
      subjectId: notificationId,
      activityData: {
        title: `You have been removed from the channel "${room.metadata.title}"`,
        channelId: roomId,
      },
      roomId,
    });

    revalidatePath(`/dashboard/channels/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    return null;
  }
};

export const deleteChannel = async (channelId: string) => {
  try {
    const room = await liveblocks.getRoom(channelId);

    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelId}`
    );

    if (response.status !== 200) {
      return null;
    }

    const creatorId = Array.isArray(room.metadata.creatorId)
      ? room.metadata.creatorId[0]
      : room.metadata.creatorId;

    // Notification for deleting a channel
    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: creatorId,
      kind: "$channelDeleted",
      subjectId: notificationId,
      activityData: {
        title: `The channel "${room.metadata.title}" has been deleted`,
        channelId: channelId,
      },
    });

    await liveblocks.deleteRoom(channelId);

    revalidatePath("/dashboard/channels");
    return parseStringify(response.data);
  } catch (error) {
    revalidatePath("/dashboard/channels");
  }
};
