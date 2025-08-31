import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const body = await request.json();

    console.log("Updating widget:", body);

    const widget = await prisma.widget.update({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
      data: {
        position: body.position,
      },
    });

    console.log("Widget updated:", widget);

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error updating widget:", error);
    return NextResponse.json(
      { error: "Error updating widget" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const body = await request.json();

    console.log("Patching widget:", params.widgetId, body);

    // Verify the widget exists and belongs to the device
    const existingWidget = await prisma.widget.findUnique({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
    });

    if (!existingWidget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    // Update only the provided fields
    const updateData: any = {};

    // Handle common widget update fields
    if (body.value !== undefined) updateData.value = body.value;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.dataSource !== undefined) updateData.dataSource = body.dataSource;

    const widget = await prisma.widget.update({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
      data: updateData,
    });

    console.log("Widget patched:", widget);

    const existingConfig = await prisma.pinConfig.findFirst({
      where: {
        widgetId: params.widgetId,
        deviceId: params.id,
      },
    });

    if (existingConfig) {
      await prisma.pinConfig.update({
        where: { id: existingConfig.id },
        data: updateData.value,
      });
    }

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error patching widget:", error);
    return NextResponse.json(
      { error: "Error updating widget" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    console.log("Deleting widget with ID:", params.widgetId);

    const widget = await prisma.widget.delete({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
    });

    console.log("Widget deleted:", widget);

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error deleting widget:", error);
    return NextResponse.json(
      { error: "Error deleting widget" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    console.log("Fetching widget with ID:", params.widgetId);

    const widget = await prisma.widget.findUnique({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
    });

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    console.log("Widget fetched:", widget);

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error fetching widget:", error);
    return NextResponse.json(
      { error: "Error fetching widget" },
      { status: 500 },
    );
  }
}
