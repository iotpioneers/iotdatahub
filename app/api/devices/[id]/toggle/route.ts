import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const token = await getToken({ req: request });

    // Check if token is null before proceeding
    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 404 },
      );
    }

    const userEmail = token.email as string;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("You must be logged in");
    }

    const device = await prisma.device.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Toggle device status between ONLINE and OFFLINE
    const newStatus = device.status === "ONLINE" ? "OFFLINE" : "ONLINE";

    const updatedDevice = await prisma.device.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedDevice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to toggle device" },
      { status: 500 },
    );
  }
}
