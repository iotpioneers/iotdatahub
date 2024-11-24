import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { deviceCreateSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const validation = deviceCreateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.errors },
      { status: 400 }
    );
  }

  const { channelId, ...deviceData } = validation.data;

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  try {
    const newDevice = await prisma.device.create({
      data: {
        ...deviceData,
        userId: user.id,
        channelId: channel.id,
        organizationId: channel.organizationId,
        status: "OFFLINE",
      },
      include: {
        user: true,
        channel: true,
        automations: true,
        alerts: true,
      },
    });

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    console.error("Error creating device:", error);
    return NextResponse.json(
      { error: "Error creating device" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const searchParams = new URL(request.url).searchParams;
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const devices = await prisma.device.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as any }),
        ...(type && { deviceType: type as any }),
      },
      include: {
        user: true,
        channel: true,
        automations: true,
        alerts: {
          where: {
            status: "ACTIVE",
          },
        },
      },
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error);
    return NextResponse.json(
      { error: "Error fetching devices" },
      { status: 500 }
    );
  }
}
