// Import required modules
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// POST function to store data in a specific field of a channel
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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

  // Check if the channel belongs to the user
  const channel = await prisma.channel.findUnique({
    where: { id },
    include: { user: true, fields: true }, // Include fields in the channel query
  });

  if (!channel || channel.userId !== user.id) {
    return NextResponse.json(
      { error: "Channel not found or unauthorized" },
      { status: 404 }
    );
  }

  const { fieldId, value } = body; // Assuming fieldId and value are sent in the request body

  // Check if the specified field belongs to the channel
  const field = channel.fields.find((f) => f.id === fieldId);

  if (!field) {
    return NextResponse.json(
      { error: "Field not found in the channel" },
      { status: 404 }
    );
  }

  try {
    // Store the data in the specified field of the channel
    const newDataPoint = await prisma.dataPoint.create({
      data: {
        value,
        fieldId,
        channelId: id,
      },
    });

    return NextResponse.json(newDataPoint, { status: 201 });
  } catch (error) {
    console.error("Error storing data in channel field:", error);
    return NextResponse.json(
      { error: "Error storing data in channel field" },
      { status: 500 }
    );
  }
}
