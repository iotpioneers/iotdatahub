import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  try {
    const { event_code, description, data } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 400 },
      );
    }

    const device = await prisma.device.findUnique({
      where: { authToken: token },
    });

    if (!device) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Create event
    const event = await prisma.deviceEvent.create({
      data: {
        deviceId: device.id,
        eventCode: event_code,
        message: description,
        data: data || {},
        severity: "INFO",
      },
    });

    // Broadcast to WebSocket clients
    if (global.wsServer) {
      global.wsServer.broadcast({
        type: "device_event",
        deviceId: device.id,
        event,
      });
    }

    return NextResponse.json({ message: "Event logged" });
  } catch (error) {
    console.error("Error logging event:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
