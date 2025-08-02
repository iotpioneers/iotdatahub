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

    // Check if pin config already exists
    const existingConfig = await prisma.pinConfig.findFirst({
      where: {
        widgetId: params.widgetId,
        deviceId: params.id,
      },
    });

    // Filter out relation fields and id from update data
    const excludedFields = ["id", "deviceId", "widgetId", "createdAt"];
    const updateData = Object.keys(body)
      .filter((key) => !excludedFields.includes(key))
      .reduce(
        (acc, key) => {
          acc[key] = body[key];
          return acc;
        },
        {} as Record<string, any>,
      );

    let pinConfig;
    if (existingConfig) {
      pinConfig = await prisma.pinConfig.update({
        where: { id: existingConfig.id },
        data: updateData,
      });
    } else {
      // For create operation, we can include deviceId and widgetId
      pinConfig = await prisma.pinConfig.create({
        data: {
          widgetId: params.widgetId,
          deviceId: params.id,
          pinType: body.pinType || "VIRTUAL",
          pinNumber: body.pinNumber?.replace("V", "") || "0",
          ...updateData, // Use filtered data here too
        },
      });
    }

    // Update widget
    await prisma.widget.update({
      where: { id: params.widgetId },
      data: {
        name: body.title || "Pin Widget",
        type: body.pinType || "VIRTUAL",
        color: body.widgetColor || "#10B981",
        widgetType: body.widgetType || "BOOLEAN",
        pinNumber: parseInt(body.pinNumber?.replace("V", "") || "0"),
        pinType: body.pinType || "VIRTUAL",
        definition: {
          type: body.pinType || "VIRTUAL",
          label: body.label || "",
          category: body.automationType || "control",
        },
        settings: {
          ...body,
          title: body.title || "Pin Configuration",
          color: body.widgetColor || "#10B981",
          min: body.minValue || 0,
          max: body.maxValue || 100,
          value:
            body.defaultValue || (body.valueType === "BOOLEAN" ? false : 0),
        },
        config: updateData, // Store the full config in the config field
      },
    });

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
