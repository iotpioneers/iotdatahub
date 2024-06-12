import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import channelSchema from "./schema";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Validate the request body against the schema
  const validation = channelSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, description, deviceId, fields } = validation.data;

  const writeApiKey = nanoid(16);
  const readApiKey = nanoid(16);

  try {
    // Create a new channel
    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        writeApiKey,
        readApiKey,
        deviceId,
        fields: {
          create: fields?.map((fieldName) => ({ name: fieldName })) || [],
        },
      },
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
  const channels = await prisma.channel.findMany();

  if (!channels)
    return NextResponse.json({ error: "Channels not found" }, { status: 404 });

  return NextResponse.json(channels);
}
