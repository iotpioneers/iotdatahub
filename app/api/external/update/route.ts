import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const urlSearchParams = new URLSearchParams(request.url.split("?")[1]);
  const authToken = urlSearchParams.get("token");
  const pinNumber = urlSearchParams.get("pin");
  const pinValue = urlSearchParams.get("value");

  console.log("Updating pin:", authToken, pinNumber, pinValue);

  if (!authToken || !pinNumber) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 },
    );
  }

  try {
    const device = await prisma.device.findUnique({
      where: { authToken: authToken },
    });

    if (!device) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const pinDigit = parseInt(pinNumber.replace("V", ""));

    // Update or create virtual pin
    await prisma.virtualPin.upsert({
      where: {
        deviceId_pinNumber: {
          deviceId: device.id,
          pinNumber: pinDigit,
        },
      },
      update: {
        value: pinValue || "",
        lastUpdated: new Date(),
      },
      create: {
        deviceId: device.id,
        pinNumber: pinDigit,
        value: pinValue || "",
        dataType: detectDataType(pinValue || ""),
      },
    });

    // Send command to device if connected
    if (global.iotdatahubServer) {
      const command = `vw\0${pinDigit}\0${pinValue || ""}`;
      await global.iotdatahubServer.sendToDevice(authToken, command);
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error("Error updating pin data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function detectDataType(
  value: string,
): "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN" {
  if (value === "true" || value === "false") return "BOOLEAN";
  if (/^\d+$/.test(value)) return "INTEGER";
  if (/^\d*\.\d+$/.test(value)) return "FLOAT";
  return "STRING";
}
