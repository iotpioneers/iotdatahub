import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pinConfig = await prisma.pinConfig.findFirst({
      where: {
        widgetId: params.widgetId,
        deviceId: params.id,
      },
    });

    if (!pinConfig) {
      return NextResponse.json(
        { error: "Pin config not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(pinConfig);
  } catch (error) {
    console.error("Error fetching pin config:", error);
    return NextResponse.json(
      { error: "Error fetching pin config" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { pinType, pinNumber, valueType, defaultValue, minValue, maxValue } =
      body;

    // Check if pin config already exists
    const existingConfig = await prisma.pinConfig.findFirst({
      where: {
        widgetId: params.widgetId,
        deviceId: params.id,
      },
    });

    let pinConfig;
    if (existingConfig) {
      pinConfig = await prisma.pinConfig.update({
        where: { id: existingConfig.id },
        data: {
          pinType,
          pinNumber,
          valueType,
          defaultValue,
          minValue,
          maxValue,
        },
      });
    } else {
      pinConfig = await prisma.pinConfig.create({
        data: {
          widgetId: params.widgetId,
          deviceId: params.id,
          pinType,
          pinNumber,
          valueType,
          defaultValue,
          minValue,
          maxValue,
        },
      });
    }

    return NextResponse.json(pinConfig, { status: existingConfig ? 200 : 201 });
  } catch (error) {
    console.error("Error saving pin config:", error);
    return NextResponse.json(
      { error: "Error saving pin config" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingConfig = await prisma.pinConfig.findFirst({
      where: {
        widgetId: params.widgetId,
        deviceId: params.id,
      },
    });

    if (!existingConfig) {
      return NextResponse.json(
        { error: "Pin config not found" },
        { status: 404 },
      );
    }

    await prisma.pinConfig.delete({
      where: { id: existingConfig.id },
    });

    return NextResponse.json({ message: "Pin config deleted" });
  } catch (error) {
    console.error("Error deleting pin config:", error);
    return NextResponse.json(
      { error: "Error deleting pin config" },
      { status: 500 },
    );
  }
}
