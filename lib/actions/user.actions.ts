"use server";

import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { UserData } from "@/types/user";
import axios from "axios";
import { connectToDB } from "../mongoose";

export const getUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    connectToDB();

    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/users/emails",
      {
        userIds,
      },
    );

    if (response.status !== 200) {
      return;
    }

    const data = await response.data;

    if (!data) return;

    const users = data.map((user: UserData) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user: UserData) => user.email === email),
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    return null;
  }
};

export const getChannelRoomUsers = async ({
  roomId,
  userEmail,
  text,
}: {
  roomId: string;
  userEmail: string;
  text: string;
}) => {
  try {
    connectToDB();

    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== userEmail,
    );

    if (text.length) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText),
      );

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    return null;
  }
};
