"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannelRoomUsers = exports.getUsers = void 0;
const utils_1 = require("../utils");
const liveblocks_1 = require("../liveblocks");
const axios_1 = __importDefault(require("axios"));
const getUsers = async ({ userIds }) => {
    try {
        const response = await axios_1.default.post(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/emails", {
            userIds,
        });
        if (response.status !== 200) {
            return;
        }
        const data = await response.data;
        if (!data)
            return;
        const users = data.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.image,
        }));
        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));
        return (0, utils_1.parseStringify)(sortedUsers);
    }
    catch (error) {
        return null;
    }
};
exports.getUsers = getUsers;
const getChannelRoomUsers = async ({ roomId, userEmail, text, }) => {
    try {
        const room = await liveblocks_1.liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== userEmail);
        if (text.length) {
            const lowerCaseText = text.toLowerCase();
            const filteredUsers = users.filter((email) => email.toLowerCase().includes(lowerCaseText));
            return (0, utils_1.parseStringify)(filteredUsers);
        }
        return (0, utils_1.parseStringify)(users);
    }
    catch (error) {
        return null;
    }
};
exports.getChannelRoomUsers = getChannelRoomUsers;
