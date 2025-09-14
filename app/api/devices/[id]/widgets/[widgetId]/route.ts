import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const body = await request.json();

    const widget = await prisma.widget.update({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
      data: {
        position: body.position,
      },
    });

    return NextResponse.json(widget);
  } catch (error) {
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
    const widget = await prisma.widget.delete({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
    });

    return NextResponse.json(widget);
  } catch (error) {
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
    const widget = await prisma.widget.findUnique({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
    });

    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json(widget);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching widget" },
      { status: 500 },
    );
  }
}
