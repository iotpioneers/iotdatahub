import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { widgetSchema } from "@/validations/schema.validation";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const widgets = await prisma.widget.findMany({
      where: {
        deviceId: device.id,
        type: { not: null }, // Only fetch widgets with a type
      },
      orderBy: { createdAt: "desc" },
      include: {
        pinConfig: true, // Include pin config in the response
      },
    });

    if (!widgets || widgets.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    return NextResponse.json(widgets);
  } catch (error) {
    console.error("Error fetching widgets:", error);
    return NextResponse.json(
      { error: "Error fetching widgets" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }

  const userEmail = token.email as string;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const device = await prisma.device.findUnique({
    where: { id: params.id },
  });

  if (!device) {
    return NextResponse.json({ error: "Device not found" }, { status: 404 });
  }

  try {
    const { id, ...data } = body;

    // Ensure type is set
    if (!data.type && data.definition?.type) {
      data.type = data.definition.type;
    }

    const widget = await prisma.widget.create({
      data: {
        ...data,
        type: data.type || "unknown", // Fallback type
        channelId: device.channelId,
        deviceId: params.id,
      },
    });

    return NextResponse.json(widget, { status: 201 });
  } catch (error) {
    console.error("Error creating widget:", error);
    return NextResponse.json(
      { error: "Error creating widget" },
      { status: 500 },
    );
  }
}
