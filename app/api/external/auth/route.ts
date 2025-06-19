import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { deviceId } = await request.json();

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Generate auth token if doesn't exist
    let authToken = device.authToken;
    if (!authToken) {
      authToken = crypto.randomBytes(16).toString("hex");
      await prisma.device.update({
        where: { id: deviceId },
        data: { authToken },
      });
    }

    return NextResponse.json({ authToken });
  } catch (error) {
    console.error("Error generating auth token:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
