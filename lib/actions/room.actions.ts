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
  creator,
  email,
  title,
  description,
}: CreateChannelRoomParams) => {
  try {
    const metadata = {
      creator,
      email,
      title,
      description,
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath("/dashboard/channels");

    return parseStringify(room);
  } catch (error) {
    return;
  }
};

export const getChannelRoom = async ({
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
      throw new Error("You do not have access to this document");
    }

    return parseStringify(room);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updateChannelRoom = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    if (updatedRoom) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
          }),
        }
      );
      if (!response.ok) {
        return null;
      }

      revalidatePath(`/dashboard/channels/${roomId}`);

      return parseStringify(updatedRoom);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });

    return parseStringify(rooms);
  } catch (error) {
    return null;
  }
};

export const updateChannelAccess = async ({
  roomId,
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
        roomId,
      });
    }

    revalidatePath(`/documents/${roomId}`);
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

    revalidatePath(`/documents/${roomId}`);
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

    try {
      await liveblocks.deleteRoom(channelId);

      revalidatePath(`/dashboard/channels`);
    } catch (error) {
      return null;
    }

    revalidatePath("/");
  } catch (error) {
    revalidatePath("/dashboard/channels");
  }
};
