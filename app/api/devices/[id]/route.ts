import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deviceUpdateSchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("Fetching device with ID:", params.id);

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
      },
    });

    console.log("Fetched device:", device);

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    return NextResponse.json(
      { error: "Error fetching device" },
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
    console.error("Error updating device:", error);
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
    console.error("Error deleting device:", error);
    return NextResponse.json(
      { error: "Error deleting device" },
      { status: 500 },
    );
  }
}
