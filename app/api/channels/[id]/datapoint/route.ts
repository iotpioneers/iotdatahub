import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Channel ID
  const body = await request.json();

  // Check if the channel exists and ensure it has a valid userId
  const channel = await prisma.channel.findUnique({
    where: { id },
  });

  if (!channel) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  if (!channel.userId) {
    return NextResponse.json(
      { error: "Channel has no associated userId" },
      { status: 400 }
    );
  }

  const { fieldData } = body; // Assuming fieldData is an array of { fieldId, value } objects

  try {
    // Validate each field in the request
    const dataPoints = [];
    for (const { fieldId, value } of fieldData) {
      const field = await prisma.field.findFirst({
        where: {
          id: fieldId,
          channelId: id,
        },
      });

      if (!field) {
        return NextResponse.json(
          { error: `Field with ID ${fieldId} not found in the channel` },
          { status: 404 }
        );
      }

      // Store the data in the specified field of the channel
      const newDataPoint = await prisma.dataPoint.create({
        data: {
          value,
          fieldId,
          channelId: id,
        },
      });

      dataPoints.push(newDataPoint);
    }

    return NextResponse.json(dataPoints, { status: 201 });
  } catch (error) {
    console.error("Error storing data in channel field:", error);
    return NextResponse.json(
      { error: "Error storing data in channel field" },
      { status: 500 }
    );
  }
}
