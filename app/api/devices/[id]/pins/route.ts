import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string } },
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.deviceId },
      include: {
        virtualPins: {
          orderBy: { pinNumber: "asc" },
        },
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json(device.virtualPins);
  } catch (error) {
    console.error("Error fetching device pins:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
