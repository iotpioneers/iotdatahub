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
    const { pin, value } = await request.json();

    if (value === undefined || pin === undefined) {
      return NextResponse.json(
        {
          error: "Value and pin are required",
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
      "Sending write hardware command to pin:",
      pin,
      "with value:",
      value,
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    // Call the method on the protocolHandler instance
    const success = await protocolHandler.sendVirtualWrite(
      device.authToken,
      pin,
      value,
    );

    console.log("====================================");
    console.log(
      "Virtual write hardware command sent:",
      success,
      "to pin:",
      pin,
      "with value:",
      value,
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    // Add return statements
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Virtual write hardware command sent successfully",
        data: {
          pin,
          value,
          deviceToken: deviceManager.maskToken(device.authToken),
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send virtual write hardware command",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API virtual write hardware send error:", error);
    return NextResponse.json(
      { error: "API virtual write hardware send error" },
      { status: 500 },
    );
  }
}
