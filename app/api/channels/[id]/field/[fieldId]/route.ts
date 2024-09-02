import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

// GET a field by its ID and return related data
export async function GET(
  request: NextRequest,
  { params }: { params: { fieldId: string } }
) {
  const field = await prisma.field.findUnique({
    where: { id: params.fieldId },
  });

  if (!field)
    return NextResponse.json({ error: "Field not found" }, { status: 404 });

  // Find data points related to the field
  const dataPoints = await prisma.dataPoint.findMany({
    where: { fieldId: field.id },
  });

  // Find the channel associated with the field
  const channel = await prisma.channel.findUnique({
    where: { id: field.channelId },
  });

  if (!channel)
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  // Find an API key associated with the field's channel
  const apiKey = await prisma.apiKey.findFirst({
    where: { channelId: channel.id },
  });

  if (!apiKey)
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });

  // Find sample codes associated with the field's channel
  const sampleCodes = await prisma.sampleCodes.findFirst({
    where: { channelId: channel.id },
  });

  if (!sampleCodes)
    return NextResponse.json(
      { error: "Sample codes not found" },
      { status: 404 }
    );

  return NextResponse.json({
    field,
    dataPoints,
    channel,
    apiKey: apiKey.apiKey,
    sampleCodes: sampleCodes.codes,
  });
}

// Update a field by its ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { fieldId: string } }
) {
  const body = await request.json();

  const field = await prisma.field.findUnique({
    where: { id: params.fieldId },
  });

  if (!field)
    return NextResponse.json({ error: "Field not found" }, { status: 404 });

  const updatedField = await prisma.field.update({
    where: { id: field.id },
    data: {
      name: body.name || field.name,
      description: body.description || field.description,
    },
  });

  if (!updatedField)
    return NextResponse.json(
      { error: "Failed to update field" },
      { status: 404 }
    );
  return NextResponse.json(updatedField);
}

// Delete a field and its related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { fieldId: string } }
) {
  // Delete related data points
  await prisma.dataPoint.deleteMany({
    where: { fieldId: params.fieldId },
  });

  // Delete the field itself
  const field = await prisma.field.delete({
    where: { id: params.fieldId },
  });

  if (!field)
    return NextResponse.json({ error: "Field not found" }, { status: 404 });

  return NextResponse.json({ message: "Field deleted", field });
}
