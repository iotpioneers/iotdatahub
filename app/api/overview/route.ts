import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 404 }
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("You must be logged in");
  }

  const users = await prisma.user.findMany();
  const organizations = await prisma.organization.findMany();
  const devices = await prisma.device.findMany();
  const channels = await prisma.channel.findMany();
  const fields = await prisma.field.findMany();
  const dataPoints = await prisma.dataPoint.findMany();

  return NextResponse.json({
    users,
    organizations,
    devices,
    channels,
    fields,
    dataPoints,
  });
}
