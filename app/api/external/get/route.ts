import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const pin = searchParams.get("pin");

  if (!token) {
    return NextResponse.json({ error: "Missing auth token" }, { status: 400 });
  }

  if (!pin) {
    return NextResponse.json(
      { error: "Missing pin parameter" },
      { status: 400 },
    );
  }

  try {
    const device = await prisma.device.findUnique({
      where: { authToken: token },
    });

    if (!device) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const pinNumber = parseInt(pin.replace("V", ""));
    const virtualPin = await prisma.virtualPin.findUnique({
      where: {
        deviceId_pinNumber: {
          deviceId: device.id,
          pinNumber,
        },
      },
    });

    if (!virtualPin) {
      return NextResponse.json([""], { status: 200 });
    }

    // Return array format like IoTDataHub
    return NextResponse.json([virtualPin.value || ""]);
  } catch (error) {
    console.error("Error getting pin data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
