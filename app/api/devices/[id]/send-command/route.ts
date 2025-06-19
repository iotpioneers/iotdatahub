import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { deviceId: string } },
) {
  try {
    const { command, pin, value } = await request.json();

    const device = await prisma.device.findUnique({
      where: { id: params.deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    if (!device.authToken) {
      return NextResponse.json(
        { error: "Device not configured" },
        { status: 400 },
      );
    }

    let iotdatahubCommand = "";
    switch (command) {
      case "virtual_write":
        iotdatahubCommand = `vw\0${pin}\0${value}`;
        break;
      case "virtual_read":
        iotdatahubCommand = `vr\0${pin}`;
        break;
      case "digital_write":
        iotdatahubCommand = `dw\0${pin}\0${value}`;
        break;
      case "digital_read":
        iotdatahubCommand = `dr\0${pin}`;
        break;
      case "analog_write":
        iotdatahubCommand = `aw\0${pin}\0${value}`;
        break;
      case "analog_read":
        iotdatahubCommand = `ar\0${pin}`;
        break;
      default:
        return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    // Send command to device
    const success = await global.iotdatahubServer?.sendToDevice(
      device.authToken,
      iotdatahubCommand,
    );

    if (!success) {
      return NextResponse.json(
        { error: "Device not connected" },
        { status: 404 },
      );
    }

    // Log the command
    await prisma.deviceLog.create({
      data: {
        deviceId: params.deviceId,
        level: "INFO",
        message: `Command sent: ${command}`,
        data: { command, pin, value },
      },
    });

    return NextResponse.json({ message: "Command sent successfully" });
  } catch (error) {
    console.error("Error sending command:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
