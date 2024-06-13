import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import channelSchema from "@/validations/schema.validation";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
  if (!token) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Validate the request body against the schema
  const validation = channelSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, description, deviceId, fields } = validation.data;

  const writeApiKey = nanoid(16);
  const readApiKey = nanoid(16);

  try {
    // Format the fields data as Prisma expects
    const formattedFields = fields?.map((fieldName: string) => ({
      name: fieldName,
    }));

    // Create a new channel with formatted fields data and associate it with the user
    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        writeApiKey,
        readApiKey,
        deviceId,
        userId: user.id,
        fields: {
          create: formattedFields || [],
        },
      },
      include: { user: true },
    });

    // Update the user's channels array
    await prisma.user.update({
      where: { id: user.id },
      data: { channels: { connect: { id: newChannel.id } } },
    });

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error) {
    console.error("Error creating channel:", error);
    return NextResponse.json(
      { error: "Error creating channel" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
  if (!token) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const channels = await prisma.channel.findMany({
    where: { userId: user.id },
  });

  if (!channels || channels.length === 0) {
    return NextResponse.json(
      { error: "No channels found for this user" },
      { status: 404 }
    );
  }

  return NextResponse.json(channels);
}
