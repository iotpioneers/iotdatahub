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

    // Validate digital value (0 or 1)
    const digitalValue = parseInt(value);
    if (digitalValue !== 0 && digitalValue !== 1) {
      return NextResponse.json(
        {
          error: "Digital value must be 0 or 1",
        },
        { status: 400 },
      );
    }
    // Call the method on the protocolHandler instance
    const success = await protocolHandler.sendDigitalWrite(
      device.authToken,
      pin,
      digitalValue,
    );

    console.log("====================================");
    console.log(
      "Digital write hardware command sent:",
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
        message: "Digital write hardware command sent successfully",
        data: {
          pin,
          value,
          deviceToken: deviceManager.maskToken(device.authToken),
        },
      });
    } else {
      NextResponse.json(
        {
          success: false,
          error: "Failed to send Digital write hardware command",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("API digital write hardware send error:", error);
    return NextResponse.json(
      { error: "API digital write hardware send error" },
      { status: 500 },
    );
  }
}
