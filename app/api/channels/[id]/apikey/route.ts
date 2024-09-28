import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// Function to handle GET requests
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Find the channel by ID using Prisma
  const channel = await prisma.channel.findUnique({
    where: { id },
  });

  // If the channel is not found, return a 404 error
  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  // Find the API key associated with the channel
  const apiKey = await prisma.apiKey.findFirst({
    where: { channelId: channel.id },
  });

  // If the API key is not found, return a 404 error
  if (!apiKey) {
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });
  }

  // Return the API key as a JSON response
  return NextResponse.json({
    apiKey,
  });
}
