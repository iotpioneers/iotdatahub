import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const device = await prisma.device.findUnique({
      where: { authToken: token },
    });

    if (!device) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();

    // Log webhook event
    await prisma.deviceEvent.create({
      data: {
        deviceId: device.id,
        eventCode: "webhook_received",
        message: "Webhook data received",
        data: body,
        severity: "INFO",
      },
    });

    // Process webhook data
    if (body.pin && body.value !== undefined) {
      const pinNumber = parseInt(body.pin.replace("V", ""));

      await prisma.virtualPin.upsert({
        where: {
          deviceId_pinNumber: {
            deviceId: device.id,
            pinNumber,
          },
        },
        update: {
          value: body.value.toString(),
          lastUpdated: new Date(),
        },
        create: {
          deviceId: device.id,
          pinNumber,
          value: body.value.toString(),
          dataType: detectDataType(body.value.toString()),
        },
      });

      // Broadcast update
      if (global.wsServer) {
        global.wsServer.broadcast(
          {
            type: "virtual_pin_update",
            deviceId: device.id,
            pin: body.pin,
            value: body.value,
            timestamp: new Date().toISOString(),
          },
          device.id,
        );
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function detectDataType(
  value: string,
): "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN" {
  if (value === "true" || value === "false") return "BOOLEAN";
  if (/^\d+$/.test(value)) return "INTEGER";
  if (/^\d*\.\d+$/.test(value)) return "FLOAT";
  return "STRING";
}
