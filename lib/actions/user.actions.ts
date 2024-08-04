"use server";

import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { User } from "@/types/user";

export const getUsersByEmails = async ({ userIds }: { userIds: string[] }) => {
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "GET",
    });

    if (!response.ok) {
      console.log(`Error fetching users: ${response.statusText}`);
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
    console.log(`Error fetching users: ${error}`);
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
    console.log(`Error fetching document users: ${error}`);
  }
};
