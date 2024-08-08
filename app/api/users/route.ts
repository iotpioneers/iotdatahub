import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany();

  if (!users) {
    return NextResponse.json({ error: "Users not found" }, { status: 404 });
  }

  return NextResponse.json(users);
}
