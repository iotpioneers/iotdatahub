import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: params.id },
  });

  if (!apiKey)
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });

  return NextResponse.json({
    apiKey,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const existingApiKey = await prisma.apiKey.findUnique({
    where: { id: params.id },
  });

  if (!existingApiKey)
    return NextResponse.json({ error: "API Key not found" }, { status: 404 });

  let newApiKey: string = "";
  let isUnique = false;
  const MAX_ATTEMPTS = 10;
  let attempts = 0;

  while (!isUnique && attempts < MAX_ATTEMPTS) {
    newApiKey = new ObjectId().toString();
    const duplicateKey = await prisma.apiKey.findUnique({
      where: { apiKey: newApiKey },
    });

    if (!duplicateKey || duplicateKey.id === existingApiKey.id) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique || existingApiKey.apiKey === "") {
    return NextResponse.json(
      { error: "Failed to generate a unique API Key after multiple attempts" },
      { status: 500 },
    );
  }

  try {
    const updatedApiKey = await prisma.apiKey.update({
      where: { id: params.id },
      data: {
        apiKey: newApiKey,
      },
    });

    if (!updatedApiKey)
      return NextResponse.json(
        { error: "Failed to update API Key" },
        { status: 500 },
      );

    return NextResponse.json(updatedApiKey);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the API Key" },
      { status: 500 },
    );
  }
}
