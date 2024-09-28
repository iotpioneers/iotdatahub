import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET({ params }: { params: { id: string } }) {
  const channel = await prisma.channel.findUnique({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  // Find a api key with the channel
  const apiKey = await prisma.apiKey.findFirst({
    where: { channelId: channel.id },
  });

  if (!apiKey)
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });

  return NextResponse.json({
    apiKey,
  });
}
