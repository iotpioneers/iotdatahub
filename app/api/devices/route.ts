import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { deviceSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
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

  // Validate the request body against the schema
  const validation = deviceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, description, channelId } = validation.data;

  // Validate the channelId
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
  });

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  try {
    // Create a new device and associate it with the user and channel
    const newDevice = await prisma.device.create({
      data: {
        name,
        description,
        userId: user.id,
        channelId: channel.id,
        organizationId: channel.organizationId,
      },
      include: { user: true, channel: true },
    });

    // Update the channel to add the new device to its devices array
    await prisma.channel.update({
      where: { id: channelId },
      data: { devices: { connect: { id: newDevice.id } } },
    });

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating device" },
      { status: 500 }
    );
  }
}

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

  const devices = await prisma.device.findMany({
    where: { userId: user.id },
    include: { user: true, channel: true },
  });

  if (!devices || devices.length === 0) {
    return NextResponse.json(
      { error: "No devices found for this user" },
      { status: 404 }
    );
  }

  return NextResponse.json(devices);
}
