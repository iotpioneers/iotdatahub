import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getUserColor } from "@/lib/utils";
import { liveblocks } from "@/lib/liveblocks";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userEmail = token.email as string;

  const userFound = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!userFound) {
    throw new Error("User not found");
  }

  const { id, firstname, lastname, email, image } = userFound;

  // Get the current user from your database
  const user = {
    id,
    info: {
      id,
      name: `${firstname} ${lastname}`,
      email: email,
      avatar: image!,
      color: getUserColor(id),
    },
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info }
  );

  return new Response(body, { status });
}
