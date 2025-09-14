import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string } },
) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get("pin");
  const hours = parseInt(searchParams.get("hours") || "24");
  const limit = parseInt(
    searchParams.get("limit") || process.env.MAX_CONNECTIONS! || "60000",
  );

  try {
    const device = await prisma.device.findUnique({
      where: { id: params.deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - hours);

    // Get pin history (you'll need to create a PinHistory model)
    const history = await prisma.pinHistory.findMany({
      where: {
        deviceId: params.deviceId,
        ...(pin && { pinNumber: parseInt(pin.replace("V", "")) }),
        createdAt: {
          gte: startTime,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(history);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching pin history" },
      { status: 500 },
    );
  }
}
