import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deviceUpdateSchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: {
        automations: true,
        alerts: true,
        commands: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        maintenance: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        virtualPins: true,
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Check recent data activity from PinHistory
    const recentData = await prisma.pinHistory.findFirst({
      where: { deviceId: params.id },
      orderBy: { timestamp: "desc" },
      select: { timestamp: true },
    });

    // Update status based on recent data (within 30 seconds = ONLINE)
    if (recentData) {
      const timeSinceData = Date.now() - new Date(recentData.timestamp).getTime();
      const computedStatus = timeSinceData < 30000 ? "ONLINE" : "OFFLINE";
      
      if (device.status !== computedStatus) {
        await prisma.device.update({
          where: { id: params.id },
          data: { status: computedStatus },
        });
        device.status = computedStatus;
      }
    }

    return NextResponse.json(device);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching device" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const updatedDevice = await prisma.device.update({
      where: { id: params.id },
      data: body.data,
      include: {
        automations: true,
        alerts: true,
        commands: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json(updatedDevice);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating device" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const validation = deviceUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.errors },
      { status: 400 },
    );
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const updatedDevice = await prisma.device.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        automations: true,
        alerts: true,
        commands: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    return NextResponse.json(updatedDevice);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating device" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const device = await prisma.device.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Device deleted successfully",
      device,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting device" },
      { status: 500 },
    );
  }
}
