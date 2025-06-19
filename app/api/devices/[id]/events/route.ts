import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { deviceId: string } },
) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const severity = searchParams.get("severity");

  try {
    const events = await prisma.deviceEvent.findMany({
      where: {
        deviceId: params.deviceId,
        ...(severity && { severity: severity as any }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
