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
      where: { deviceId: device.id },
      orderBy: { createdAt: "desc" },
    });

    if (!widgets || widgets.length === 0) {
      return NextResponse.json({ error: "No widgets found" }, { status: 404 });
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

  console.log("Body --------------------------------------", body);

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
