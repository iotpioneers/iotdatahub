import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get the most recent pin history entry for this device
    const recentActivity = await prisma.pinHistory.findFirst({
      where: {
        deviceId: params.id,
      },
      orderBy: {
        timestamp: "desc",
      },
      select: {
        timestamp: true,
        pinNumber: true,
        value: true,
      },
    });

    if (!recentActivity) {
      return NextResponse.json({
        lastActivity: null,
        hasRecentData: false,
      });
    }

    const now = new Date();
    const timeSinceLastData = now.getTime() - new Date(recentActivity.timestamp).getTime();
    const hasRecentData = timeSinceLastData < 10000; // Within last 10 seconds

    return NextResponse.json({
      lastActivity: recentActivity.timestamp,
      hasRecentData,
      timeSinceLastData,
      lastPin: recentActivity.pinNumber,
      lastValue: recentActivity.value,
    });
  } catch (error) {
    console.error("Error checking recent pin history:", error);
    return NextResponse.json(
      { error: "Error checking recent activity" },
      { status: 500 },
    );
  }
}
