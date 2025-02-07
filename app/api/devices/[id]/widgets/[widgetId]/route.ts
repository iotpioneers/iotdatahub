import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  try {
    const body = await request.json();

    console.log("Updating widget:", body);

    const widget = await prisma.widget.update({
      where: {
        id: params.widgetId,
        deviceId: params.id,
      },
      data: {
        position: body.position,
      },
    });

    console.log("Widget updated:", widget);

    return NextResponse.json(widget);
  } catch (error) {
    console.error("Error updating widget:", error);
    return NextResponse.json(
      { error: "Error updating widget" },
      { status: 500 },
    );
  }
}
