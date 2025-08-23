import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: "Device token is required" },
        { status: 400 },
      );
    }

    // Find device by authToken (adjust field name based on your schema)
    const device = await prisma.device.findFirst({
      where: {
        authToken: token,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: device.id,
      name: device.name,
      status: device.status,
    });
  } catch (error) {
    console.error("Error mapping device token to ID:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
