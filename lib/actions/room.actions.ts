"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "../utils";
import { RoomPermission } from "@liveblocks/node";
import {
  ChannelAccessType,
  CreateChannelRoomParams,
  RoomAccesses,
  ShareChannelParams,
  UserAccessType,
} from "@/types/uni-types";
import axios from "axios";
import prisma from "@/prisma/client";

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

    if (!room) {
      return { error: "Failed to create channel room" };
    }

    revalidatePath("/dashboard/channels");

    return parseStringify(room);
  } catch (error) {
    return { error: "Failed to create channel room" };
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

    return parseStringify(room);
  } catch (error) {
    return { error: error };
    return { error: error };
  }
};

export const updateChannelRoomData = async (
  channelId: string,
  title: string
) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelId}`,
      { name: title }
    );

    if (response.status !== 200) {
      return { error: "Failed to update channel data" };
      return { error: "Failed to update channel data" };
    }

    const updateChannelRoom = await liveblocks.updateRoom(channelId, {
      metadata: { title },
    });

    const creatorId = Array.isArray(updateChannelRoom.metadata.creatorId)
      ? updateChannelRoom.metadata.creatorId[0]
      : updateChannelRoom.metadata.creatorId;

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

    revalidatePath(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${channelId}`
    );

    return parseStringify(updateChannelRoom);
  } catch (error) {
    return { error: "Failed to update channel room data" };
    return { error: "Failed to update channel room data" };
  }
};

export const updateChannelAccess = async ({
  roomId,
  collaborators,
  notifyPeople,
  message,
  updatedBy,
}: ShareChannelParams) => {
  try {
    const usersAccesses: RoomAccesses = {};
    collaborators.forEach((collaborator) => {
      usersAccesses[collaborator.email] = getAccessType(
        collaborator.userType
      ) as ChannelAccessType;
    });

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });

    // Update or create ChannelAccess records
    for (const collaborator of collaborators) {
      const ChannelAccessType =
        collaborator.userType === "editor" ? "EDITOR" : "VIEWER";

      const channelAccess = await prisma.channelAccess.findFirst({
        where: {
          userEmail: collaborator.email,
          channelId: roomId,
        },
      });

      if (channelAccess) {
        await prisma.channelAccess.update({
          where: {
            id: channelAccess.id,
          },
          data: {
            accessType: ChannelAccessType,
          },
        });
      } else {
        await prisma.channelAccess.create({
          data: {
            channelId: roomId,
            accessType: ChannelAccessType,
            userEmail: collaborator.email,
            ownerName: updatedBy.name,
            ownerEmail: updatedBy.email,
            ownerImage: updatedBy.avatar || "",
          },
        });
      }
    }

    // Update or create ChannelAccess records
    for (const collaborator of collaborators) {
      const ChannelAccessType =
        collaborator.userType === "editor" ? "EDITOR" : "VIEWER";

      const channelAccess = await prisma.channelAccess.findFirst({
        where: {
          userEmail: collaborator.email,
          channelId: roomId,
        },
      });

      if (channelAccess) {
        await prisma.channelAccess.update({
          where: {
            id: channelAccess.id,
          },
          data: {
            accessType: ChannelAccessType,
          },
        });
      } else {
        await prisma.channelAccess.create({
          data: {
            channelId: roomId,
            accessType: ChannelAccessType,
            userEmail: collaborator.email,
            ownerName: updatedBy.name,
            ownerEmail: updatedBy.email,
            ownerImage: updatedBy.avatar || "",
          },
        });
      }
    }

    if (notifyPeople) {
      for (const collaborator of collaborators) {
        const notificationId = nanoid();
        await liveblocks.triggerInboxNotification({
          userId: collaborator.email,
          kind: "$channelRoomAccess",
          subjectId: notificationId,
          activityData: {
            userType: collaborator.userType,
            title: `You have been granted ${
              collaborator.userType
            } access to the channel "${room.metadata.title}" by ${
              updatedBy.name
            } ${message && `The message from sender is: ${message}`}`,
            updatedBy: updatedBy.name,
            image: updatedBy.avatar,
            email: updatedBy.email,
            channelId: roomId,
          },
          roomId,
        });
      }
    }

    revalidatePath(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${roomId}`
    );
    return parseStringify(room);
  } catch (error) {
    return { error: "Failed to update channel access" };
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
      return { error: "You cannot remove yourself from the document" };
    }

    const updatedUsersAccesses = {
      ...room.usersAccesses,
      [email]: null,
    };

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: updatedUsersAccesses,
    });

    await prisma.channelAccess.deleteMany({
      where: {
        channelId: roomId,
        userEmail: email,
      },
    });

    await prisma.channelAccess.deleteMany({
      where: {
        channelId: roomId,
        userEmail: email,
      },
    });

    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: email,
      kind: "$channelRoomAccess",
      subjectId: notificationId,
      activityData: {
        title: `You have been removed from the channel "${room.metadata.title}"`,
        roomId,
      },
      roomId,
    });

    revalidatePath(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${roomId}`
    );
    return parseStringify(updatedRoom);
  } catch (error) {
    return { error: "Failed to remove collaborator" };
  }
};

export const deleteChannel = async (channelId: string) => {
  try {
    const room = await liveblocks.getRoom(channelId);

    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelId}`
    );

    if (response.status !== 200) {
      return { error: "Failed to delete channel" };
    }

    const creatorId = Array.isArray(room.metadata.creatorId)
      ? room.metadata.creatorId[0]
      : room.metadata.creatorId;

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

    revalidatePath(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard/channels");
    return parseStringify(response.data);
  } catch (error) {
    revalidatePath(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard/channels");
    return { error: "Failed to delete channel" };
  }
};

export const updateRoomDefaultAccess = async (
  roomId: string,
  defaultAccesses: RoomPermission
) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      defaultAccesses,
    });

    if (!updatedRoom) {
      return { error: "Error updating room default access" };
    }

    const creatorId = Array.isArray(room.metadata.creatorId)
      ? room.metadata.creatorId[0]
      : room.metadata.creatorId;

    const notificationId = nanoid();
    await liveblocks.triggerInboxNotification({
      userId: creatorId,
      kind: "$channelDefaultAccessUpdated",
      subjectId: notificationId,
      activityData: {
        title: `The general access for channel "${room.metadata.title}" has been updated`,
        channelId: roomId,
      },
      roomId,
    });

    revalidatePath(`/dashboard/channels/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    return { error: "Failed to update room default access" };
  }
};
