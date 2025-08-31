import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      deviceToken,
      firmware,
      model,
      ipAddress,
      metadata,
      lastPing,
      status = "ONLINE",
    } = body;

    if (!deviceToken) {
      return NextResponse.json(
        { error: "Device token is required" },
        { status: 400 },
      );
    }

    // Find the device by auth token
    const device = await prisma.device.findUnique({
      where: { authToken: deviceToken },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Make device type as GATEWAY if model start with ESP

    const deviceType =
      model && model.startsWith("ESP")
        ? "GATEWAY"
        : model.startsWith("ARDUINO")
          ? "CONTROLLER"
          : device.deviceType;

    // Update device with new information
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: {
        firmware: firmware || device.firmware,
        model: model || device.model,
        ipAddress: ipAddress || device.ipAddress,
        deviceType: deviceType,
        metadata: metadata
          ? {
              ...((device.metadata as object) || {}),
              ...metadata,
            }
          : device.metadata,
        lastPing: lastPing ? new Date(lastPing) : new Date(),
        status: status,
      },
    });

    // Log the device info update
    await prisma.deviceLog.create({
      data: {
        deviceId: device.id,
        level: "INFO",
        message: "Device information updated",
        data: {
          updatedFields: {
            firmware: !!firmware,
            model: !!model,
            ipAddress: !!ipAddress,
            metadata: !!metadata,
          },
          source: "socket_connection",
        },
      },
    });

    return NextResponse.json({
      success: true,
      device: updatedDevice.name,
      deviceId: updatedDevice.id,
      updatedFields: {
        firmware: !!firmware,
        model: !!model,
        ipAddress: !!ipAddress,
        metadata: !!metadata,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error storing device info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
