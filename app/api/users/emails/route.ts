import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface UserIds {
  userIds: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { userIds }: UserIds = await request.json();

    const usersFound = await prisma.user.findMany({
      where: { email: { in: userIds } },
    });

    if (usersFound.length === 0) {
      console.log("No users found for the provided emails");
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    return NextResponse.json(usersFound);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
