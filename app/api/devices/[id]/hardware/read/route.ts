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
    const { pin, type = "Read" } = await request.json();

    if (pin === undefined) {
      return NextResponse.json(
        {
          error: "Value and pin are required",
          example: {
            pin: 3,
            type: "Read", // or 'digital'
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
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    // Call the method on the protocolHandler instance

    let success;
    if (type === "digital") {
      // Call the method on the protocolHandler instance
      success = await protocolHandler.sendDigitalRead(device.authToken, pin);
    } else {
      // Call the method on the protocolHandler instance
      success = await protocolHandler.sendVirtualRead(device.authToken, pin);
    }

    console.log("====================================");
    console.log(
      "Read hardware command sent:",
      success,
      "to pin:",
      pin,
      "to device:",
      device.authToken,
    );
    console.log("====================================");

    if (success) {
      NextResponse.json({
        success: true,
        message: "Read hardware command sent successfully",
        data: {
          pin,
          deviceToken: deviceManager.maskToken(device.authToken),
        },
      });
    } else {
      NextResponse.json(
        {
          success: false,
          error: "Failed to send read hardware command",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API read hardware send error:", error);
    return NextResponse.json(
      { error: "API read hardware send error" },
      { status: 500 },
    );
  }
}
