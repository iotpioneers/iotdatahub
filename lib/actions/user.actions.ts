"use server";

import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { User } from "@/types/user";

export const getUsersByEmails = async ({ userIds }: { userIds: string[] }) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/users",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (!data) return;

    const users = data.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.image,
    }));

    const sortedUsers = userIds.map((email) =>
      users.find((user: User) => user.email === email)
    );

    return parseStringify(sortedUsers);
  } catch (error) {
    return null;
  }
};

export const getDocumentUsers = async ({
  roomId,
  currentUser,
  text,
}: {
  roomId: string;
  currentUser: string;
  text: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = Object.keys(room.usersAccesses).filter(
      (email) => email !== currentUser
    );

    if (text.length) {
      const lowerCaseText = text.toLowerCase();

      const filteredUsers = users.filter((email: string) =>
        email.toLowerCase().includes(lowerCaseText)
      );

      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    return null;
  }
};
