import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { deviceSchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const device = await prisma.device.findUnique({
    where: { id: params.id },
  });

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  return NextResponse.json(device);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const validation = deviceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const device = await prisma.device.findUnique({
    where: { id: params.id },
  });

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  const updatedDevice = await prisma.device.update({
    where: { id: device.id },
    data: {
      name: body.name,
      description: body.description,
      // Include other fields you want to update
    },
  });

  return NextResponse.json(updatedDevice);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const device = await prisma.device.delete({
    where: { id: params.id },
  });

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Device deleted", device });
}
