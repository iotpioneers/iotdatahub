import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.device.update({
      where: { id: params.id },
      data: {
        status: "ONLINE",
        lastPing: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}

export async function PUT() {
  const offlineThreshold = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

  await prisma.device.updateMany({
    where: {
      lastPing: { lt: offlineThreshold },
      status: "ONLINE",
    },
    data: {
      status: "OFFLINE",
    },
  });
}
