import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { commandSchema, widgetSchema } from "@/validations/schema.validation";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; widgetId: string } },
) {
  const body = await request.json();
  const validation = commandSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validation failed", details: validation.error.errors },
      { status: 400 },
    );
  }
  try {
    const widget = await prisma.widget.findUnique({
      where: { id: params.widgetId },
      include: { device: true },
    });

    if (!widget) throw new Error("Widget not found");

    // Create a device command based on the widget action
    await prisma.deviceCommand.create({
      data: {
        deviceId: widget.deviceId,
        payload: validation.data.payload,
        type: validation.data.type,
      },
    });

    return NextResponse.json({
      message: "Command created successfully",
      command: validation.data,
    });
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
  { params }: { params: { id: string; widgetId: string } },
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

  // const validation = widgetSchema.safeParse(body);

  // console.log("Validation result for widget:", validation);

  // if (!validation.success) {
  //   return NextResponse.json(
  //     { error: "Validation failed", details: validation.error.errors },
  //     { status: 400 },
  //   );
  // }

  try {
    const { id, ...data } = body;
    const widget = await prisma.widget.create({
      data: {
        ...data,
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
