import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { commandSchema } from "@/validations/schema.validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = commandSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.errors },
      { status: 400 }
    );
  }

  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const command = await prisma.deviceCommand.create({
      data: {
        ...validation.data,
        deviceId: params.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(command, { status: 201 });
  } catch (error) {
    console.error("Error creating command:", error);
    return NextResponse.json(
      { error: "Error creating command" },
      { status: 500 }
    );
  }
}
