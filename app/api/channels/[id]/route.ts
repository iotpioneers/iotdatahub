import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { channelSchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const channel = await prisma.channel.findUnique({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  // Find a fields with the channel
  const fields = await prisma.field.findMany({
    where: { channelId: channel.id },
  });

  // Find a data point with the channel
  const dataPoint = await prisma.dataPoint.findMany({
    where: { channelId: channel.id },
  });

  // Find a api key with the channel
  const apiKey = await prisma.apiKey.findFirst({
    where: { channelId: channel.id },
  });

  if (!apiKey)
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });

  // Find a sample codes with the channel
  const sampleCodes = await prisma.sampleCodes.findFirst({
    where: { apiKeyId: apiKey.id },
  });

  if (!sampleCodes)
    return NextResponse.json(
      { error: "Sample codes not found" },
      { status: 404 }
    );

  return NextResponse.json({
    channel,
    dataPoint,
    fields,
    apiKey: apiKey.apiKey,
    sampleCodes: sampleCodes.codes,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const validation = channelSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const channel = await prisma.channel.findUnique({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  const updatedchannel = await prisma.channel.update({
    where: { id: channel.id },
    data: {
      name: body.name,
      description: body.description,
    },
  });

  return NextResponse.json(updatedchannel);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const channel = await prisma.channel.delete({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "channel not found" }, { status: 404 });

  return NextResponse.json({ message: "Channel deleted,", channel });
}
