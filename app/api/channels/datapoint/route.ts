import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const urlSearchParams = new URLSearchParams(request.url.split("?")[1]);
  const api_key = urlSearchParams.get("api_key");
  const fieldNumber = Array.from(urlSearchParams.keys())
    .filter((key) => key.startsWith("field"))
    .map((key) => Number(key.split("field")[1]))[0];

  try {
    if (!api_key) {
      return NextResponse.json(
        { error: "API_Key not provided" },
        { status: 400 }
      );
    }

    // Check if the apiKey exists and ensure it has a valid channelId
    const apiKey = await prisma.apiKey.findUnique({
      where: { apiKey: api_key },
      include: { channel: true },
    });

    if (!apiKey || !apiKey.channel) {
      return NextResponse.json({ error: "Invalid API_Key" }, { status: 404 });
    }

    // Find the corresponding field name based on fieldNumber
    const fieldName = apiKey.fields[fieldNumber - 1];

    if (!fieldName) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    const fieldExist = await prisma.field.findFirst({
      where: { name: fieldName },
    });

    if (!fieldExist) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Extract field value from query parameters
    const fieldValue = urlSearchParams.get(`field${fieldNumber}`);
    const numericValue = parseInt(fieldValue || "", 10);

    if (isNaN(numericValue)) {
      return NextResponse.json(
        { error: "Invalid field value" },
        { status: 400 }
      );
    }

    // Create a new data point with the provided value
    const newDataPoint = await prisma.dataPoint.create({
      data: {
        value: numericValue,
        fieldId: fieldExist.id,
        channelId: apiKey.channelId,
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

export async function GET(request: NextRequest) {
  const urlSearchParams = new URLSearchParams(request.url.split("?")[1]);
  const api_key = urlSearchParams.get("api_key");
  const fieldNumber = Array.from(urlSearchParams.keys())
    .filter((key) => key.startsWith("field"))
    .map((key) => Number(key.split("field")[1]))[0];

  try {
    if (!api_key) {
      return NextResponse.json(
        { error: "API_Key not provided" },
        { status: 400 }
      );
    }

    // Check if the apiKey exists and ensure it has a valid channelId
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: api_key },
      include: { channel: true },
    });

    if (!apiKey || !apiKey.channel) {
      return NextResponse.json({ error: "Invalid API_Key" }, { status: 404 });
    }

    // Find the corresponding field name based on fieldNumber
    const fieldNames = apiKey.fields;
    const fieldName = fieldNames[fieldNumber - 1];

    if (!fieldName) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    const fieldExist = await prisma.field.findFirst({
      where: { name: fieldName },
    });

    if (!fieldExist) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 });
    }

    // Find a data point with the provided value
    const dataPoint = await prisma.dataPoint.findFirst({
      where: { fieldId: fieldExist.id },
    });

    if (!dataPoint) {
      return NextResponse.json(
        { error: "Data point not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dataPoint, { status: 200 });
  } catch (error) {
    console.error("Error fetching data point:", error);
    return NextResponse.json(
      { error: "Error fetching data point" },
      { status: 500 }
    );
  }
}
