import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { pin, value, widgetId } = await request.json();

    if (value === undefined || pin === undefined || widgetId === undefined) {
      return NextResponse.json(
        {
          error: "Value, pin, and widgetId are required",
          example: {
            command: "vw",
            pin: 3,
            value: 1,
            widgetId: "1234",
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
        const widget = await prisma.widget.findUnique({
          where: {
            id: widgetId,
          },
        });

        if (widget) {
          await prisma.widget.update({
            where: {
              id: widget.id,
            },
            data: {
              value: value.toString(),
            },
          });
        }

        // Store in pin history for analytics
        await prisma.pinHistory.create({
          data: {
            deviceId: device.id,
            pinNumber: parseInt(pin.toString()),
            value: value.toString(),
            dataType: "STRING",
            timestamp: new Date(),
          },
        });

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
    return NextResponse.json(
      { error: "API virtual write hardware send error" },
      { status: 500 },
    );
  }
}
