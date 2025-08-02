import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("====================================");
    console.log("Received widget data:", body);
    console.log("====================================");

    const { deviceToken, pinNumber, value, dataType = "STRING" } = body;

    if (!deviceToken || pinNumber === undefined || value === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: deviceToken, pinNumber, value" },
        { status: 400 },
      );
    }

    // Find the device by auth token
    const device = await prisma.device.findUnique({
      where: { authToken: deviceToken },
    });

    console.log("====================================");
    console.log("Received device data:", device);
    console.log("====================================");

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Update device status to ONLINE since we're receiving data
    await prisma.device.update({
      where: { id: device.id },
      data: {
        status: "ONLINE",
        lastPing: new Date(),
      },
    });

    // Upsert virtual pin data
    await prisma.virtualPin.upsert({
      where: {
        deviceId_pinNumber: {
          deviceId: device.id,
          pinNumber: parseInt(pinNumber.toString()),
        },
      },
      update: {
        value: value.toString(),
        dataType: dataType,
        lastUpdated: new Date(),
      },
      create: {
        deviceId: device.id,
        pinNumber: parseInt(pinNumber.toString()),
        value: value.toString(),
        dataType: dataType,
        lastUpdated: new Date(),
      },
    });

    // Store in pin history for analytics
    await prisma.pinHistory.create({
      data: {
        deviceId: device.id,
        pinNumber: parseInt(pinNumber.toString()),
        value: value.toString(),
        dataType: dataType,
        timestamp: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      device: device.name,
      pin: `V${pinNumber}`,
      value: value,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error storing hardware data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const deviceToken = searchParams.get("deviceToken");
    const pinNumber = searchParams.get("pinNumber");

    console.log("====================================");
    console.log(
      "Received GET request for hardware data:",
      "deviceToken:",
      deviceToken,
      "pinNumber:",
      pinNumber,
    );
    console.log("====================================");

    if (!deviceToken) {
      return NextResponse.json(
        { error: "Device token is required" },
        { status: 400 },
      );
    }

    // Find the device by auth token
    const device = await prisma.device.findUnique({
      where: { authToken: deviceToken },
      include: {
        virtualPins: pinNumber
          ? { where: { pinNumber: parseInt(pinNumber) } }
          : true,
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({
      device: {
        id: device.id,
        name: device.name,
        status: device.status,
        lastPing: device.lastPing,
      },
      virtualPins: device.virtualPins.map((pin) => ({
        pin: `V${pin.pinNumber}`,
        value: pin.value,
        dataType: pin.dataType,
        lastUpdated: pin.lastUpdated,
      })),
    });
  } catch (error) {
    console.error("Error fetching hardware data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
