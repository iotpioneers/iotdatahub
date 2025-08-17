import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import SimpleDeviceManager from "@/lib/hardwareServer/deviceManager";
import SimpleProtocolHandler from "@/lib/hardwareServer/protocolHandler";

const deviceManager = new SimpleDeviceManager();
const protocolHandler = new SimpleProtocolHandler(deviceManager);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { command, pin, value } = await request.json();

    if (!command || pin === undefined || value === undefined) {
      return NextResponse.json(
        {
          error: "Command, value, and pin are required",
          example: {
            command: "vw",
            pin: 3,
            value: 1,
          },
        },
        { status: 400 },
      );
    }

    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    console.log("====================================");
    console.log(
      "Sending hardware command:",
      command,
      "to pin:",
      pin,
      "with value:",
      value,
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    // Call the method on the protocolHandler instance
    const success = await protocolHandler.sendHardwareCommand(
      device.authToken,
      command,
      pin,
      value,
    );

    console.log("====================================");
    console.log(
      "Hardware command sent:",
      success,
      "to pin:",
      pin,
      "with value:",
      value,
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    if (success) {
      NextResponse.json({
        success: true,
        message: "Hardware command sent successfully",
        data: {
          command,
          pin,
          value,
          deviceToken: deviceManager.maskToken(device.authToken),
        },
      });
    } else {
      NextResponse.json(
        {
          success: false,
          error: "Failed to send hardware command",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API hardware send error:", error);
    return NextResponse.json(
      { error: "API hardware send error" },
      { status: 500 },
    );
  }
}
