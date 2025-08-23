import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { pin, value } = await request.json();

    if (value === undefined || pin === undefined) {
      return NextResponse.json(
        {
          error: "Value and pin are required",
          example: {
            command: "vw",
            pin: 3,
            value: 1,
          },
        },
        { status: 400 },
      );
    }

    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Make HTTP request to the hardware API server
    try {
      const response = await fetch(
        `${process.env.HARDWARE_APP_BASE_URL}/api/hardware/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceToken: device.authToken,
            command: "vw",
            pin,
            value,
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update widget value in the database
        const widget = await prisma.widget.findFirst({
          where: {
            deviceId: params.id,
            pinNumber: pin,
          },
        });

        if (widget) {
          await prisma.widget.update({
            where: {
              id: widget.id,
            },
            data: {
              value,
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: "Virtual write hardware command sent successfully",
          data: result.data,
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            error:
              result.error || "Failed to send virtual write hardware command",
          },
          { status: response.status || 500 },
        );
      }
    } catch (fetchError) {
      console.error(
        "Failed to communicate with hardware API server:",
        fetchError,
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to communicate with hardware API server. Make sure it's running on port 3001.",
        },
        { status: 503 },
      );
    }
  } catch (error) {
    console.error("API virtual write hardware send error:", error);
    return NextResponse.json(
      { error: "API virtual write hardware send error" },
      { status: 500 },
    );
  }
}
