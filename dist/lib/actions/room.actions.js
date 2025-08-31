"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoomDefaultAccess = exports.deleteChannel = exports.removeCollaborator = exports.updateChannelAccess = exports.updateChannelRoomData = exports.getRoomAccess = exports.createChannelRoom = void 0;
const nanoid_1 = require("nanoid");
const liveblocks_1 = require("../liveblocks");
const cache_1 = require("next/cache");
const utils_1 = require("../utils");
const axios_1 = __importDefault(require("axios"));
const client_1 = __importDefault(require("@/prisma/client"));
const createChannelRoom = async ({ roomId, userId, email, title, }) => {
    try {
        const metadata = {
            creatorId: userId,
            email,
            title,
        };
        const usersAccesses = {
            [email]: ["room:write"],
        };
        const room = await liveblocks_1.liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: [],
        });
        if (!room) {
            return { error: "Failed to create channel room" };
        }
        (0, cache_1.revalidatePath)("/dashboard/channels");
        return (0, utils_1.parseStringify)(room);
    }
    catch (error) {
        return { error: "Failed to create channel room" };
    }
};
exports.createChannelRoom = createChannelRoom;
const getRoomAccess = async ({ roomId, userEmail, }) => {
    try {
        const room = await liveblocks_1.liveblocks.getRoom(roomId);
        return (0, utils_1.parseStringify)(room);
    }
    catch (error) {
        return { error: error };
        return { error: error };
    }
};
exports.getRoomAccess = getRoomAccess;
const updateChannelRoomData = async (channelId, title) => {
    try {
        const response = await axios_1.default.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelId}`, { name: title });
        if (response.status !== 200) {
            return { error: "Failed to update channel data" };
            return { error: "Failed to update channel data" };
        }
        const updateChannelRoom = await liveblocks_1.liveblocks.updateRoom(channelId, {
            metadata: { title },
        });
        const creatorId = Array.isArray(updateChannelRoom.metadata.creatorId)
            ? updateChannelRoom.metadata.creatorId[0]
            : updateChannelRoom.metadata.creatorId;
        const notificationId = (0, nanoid_1.nanoid)();
        await liveblocks_1.liveblocks.triggerInboxNotification({
            userId: creatorId,
            kind: "$channelUpdated",
            subjectId: notificationId,
            activityData: {
                title: `The channel "${title}" has been updated`,
                channelId: channelId,
            },
            roomId: channelId,
        });
        (0, cache_1.revalidatePath)(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${channelId}`);
        return (0, utils_1.parseStringify)(updateChannelRoom);
    }
    catch (error) {
        return { error: "Failed to update channel room data" };
        return { error: "Failed to update channel room data" };
    }
};
exports.updateChannelRoomData = updateChannelRoomData;
const updateChannelAccess = async ({ roomId, collaborators, notifyPeople, message, updatedBy, }) => {
    try {
        const usersAccesses = {};
        collaborators.forEach((collaborator) => {
            usersAccesses[collaborator.email] = (0, utils_1.getAccessType)(collaborator.userType);
        });
        const room = await liveblocks_1.liveblocks.updateRoom(roomId, {
            usersAccesses,
        });
        // Update or create ChannelAccess records
        for (const collaborator of collaborators) {
            const ChannelAccessType = collaborator.userType === "editor" ? "EDITOR" : "VIEWER";
            const channelAccess = await client_1.default.channelAccess.findFirst({
                where: {
                    userEmail: collaborator.email,
                    channelId: roomId,
                },
            });
            if (channelAccess) {
                await client_1.default.channelAccess.update({
                    where: {
                        id: channelAccess.id,
                    },
                    data: {
                        accessType: ChannelAccessType,
                    },
                });
            }
            else {
                await client_1.default.channelAccess.create({
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
            const ChannelAccessType = collaborator.userType === "editor" ? "EDITOR" : "VIEWER";
            const channelAccess = await client_1.default.channelAccess.findFirst({
                where: {
                    userEmail: collaborator.email,
                    channelId: roomId,
                },
            });
            if (channelAccess) {
                await client_1.default.channelAccess.update({
                    where: {
                        id: channelAccess.id,
                    },
                    data: {
                        accessType: ChannelAccessType,
                    },
                });
            }
            else {
                await client_1.default.channelAccess.create({
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
                const notificationId = (0, nanoid_1.nanoid)();
                await liveblocks_1.liveblocks.triggerInboxNotification({
                    userId: collaborator.email,
                    kind: "$channelRoomAccess",
                    subjectId: notificationId,
                    activityData: {
                        userType: collaborator.userType,
                        title: `You have been granted ${collaborator.userType} access to the channel "${room.metadata.title}" by ${updatedBy.name} ${message && `The message from sender is: ${message}`}`,
                        updatedBy: updatedBy.name,
                        image: updatedBy.avatar,
                        email: updatedBy.email,
                        channelId: roomId,
                    },
                    roomId,
                });
            }
        }
        (0, cache_1.revalidatePath)(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${roomId}`);
        return (0, utils_1.parseStringify)(room);
    }
    catch (error) {
        return { error: "Failed to update channel access" };
    }
};
exports.updateChannelAccess = updateChannelAccess;
const removeCollaborator = async ({ roomId, email, }) => {
    try {
        const room = await liveblocks_1.liveblocks.getRoom(roomId);
        if (room.metadata.email === email) {
            return { error: "You cannot remove yourself from the document" };
        }
        const updatedUsersAccesses = {
            ...room.usersAccesses,
            [email]: null,
        };
        const updatedRoom = await liveblocks_1.liveblocks.updateRoom(roomId, {
            usersAccesses: updatedUsersAccesses,
        });
        await client_1.default.channelAccess.deleteMany({
            where: {
                channelId: roomId,
                userEmail: email,
            },
        });
        await client_1.default.channelAccess.deleteMany({
            where: {
                channelId: roomId,
                userEmail: email,
            },
        });
        const notificationId = (0, nanoid_1.nanoid)();
        await liveblocks_1.liveblocks.triggerInboxNotification({
            userId: email,
            kind: "$channelRoomAccess",
            subjectId: notificationId,
            activityData: {
                title: `You have been removed from the channel "${room.metadata.title}"`,
                roomId,
            },
            roomId,
        });
        (0, cache_1.revalidatePath)(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/channels/${roomId}`);
        return (0, utils_1.parseStringify)(updatedRoom);
    }
    catch (error) {
        return { error: "Failed to remove collaborator" };
    }
};
exports.removeCollaborator = removeCollaborator;
const deleteChannel = async (channelId) => {
    try {
        const room = await liveblocks_1.liveblocks.getRoom(channelId);
        const response = await axios_1.default.delete(process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelId}`);
        if (response.status !== 200) {
            return { error: "Failed to delete channel" };
        }
        const creatorId = Array.isArray(room.metadata.creatorId)
            ? room.metadata.creatorId[0]
            : room.metadata.creatorId;
        const notificationId = (0, nanoid_1.nanoid)();
        await liveblocks_1.liveblocks.triggerInboxNotification({
            userId: creatorId,
            kind: "$channelDeleted",
            subjectId: notificationId,
            activityData: {
                title: `The channel "${room.metadata.title}" has been deleted`,
                channelId: channelId,
            },
        });
        await liveblocks_1.liveblocks.deleteRoom(channelId);
        (0, cache_1.revalidatePath)(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard/channels");
        return (0, utils_1.parseStringify)(response.data);
    }
    catch (error) {
        (0, cache_1.revalidatePath)(process.env.NEXT_PUBLIC_BASE_URL + "/dashboard/channels");
        return { error: "Failed to delete channel" };
    }
};
exports.deleteChannel = deleteChannel;
const updateRoomDefaultAccess = async (roomId, defaultAccesses) => {
    try {
        const room = await liveblocks_1.liveblocks.getRoom(roomId);
        const updatedRoom = await liveblocks_1.liveblocks.updateRoom(roomId, {
            defaultAccesses,
        });
        if (!updatedRoom) {
            return { error: "Error updating room default access" };
        }
        const creatorId = Array.isArray(room.metadata.creatorId)
            ? room.metadata.creatorId[0]
            : room.metadata.creatorId;
        const notificationId = (0, nanoid_1.nanoid)();
        await liveblocks_1.liveblocks.triggerInboxNotification({
            userId: creatorId,
            kind: "$channelDefaultAccessUpdated",
            subjectId: notificationId,
            activityData: {
                title: `The general access for channel "${room.metadata.title}" has been updated`,
                channelId: roomId,
            },
            roomId,
        });
        (0, cache_1.revalidatePath)(`/dashboard/channels/${roomId}`);
        return (0, utils_1.parseStringify)(updatedRoom);
    }
    catch (error) {
        return { error: "Failed to update room default access" };
    }
};
exports.updateRoomDefaultAccess = updateRoomDefaultAccess;
