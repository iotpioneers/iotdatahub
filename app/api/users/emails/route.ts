import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

interface UserIds {
  userIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { userIds }: UserIds = await request.json();
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = token.email as string;

    console.log("user", userEmail);
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: "User IDs are required and should be an array" },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: { email: { in: userIds } },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
