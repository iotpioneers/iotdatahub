import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Get pagination parameters from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
      include: {
        fields: true,
        dataPoints: true,
        devices: {
          include: {
            widgets: true,
          },
          skip,
          take: limit,
        },
        widgets: {
          include: {
            device: true,
          },
        },
      },
    });

    if (!channel)
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });

    // Get total device count for pagination
    const totalDevices = await prisma.device.count({
      where: { channelId: params.id },
    });

    // Build widget data from pin history - organized by widget ID
    const widgetData: Record<
      string,
      {
        widgetId: string;
        deviceId: string;
        pinNumber: number;
        widgetName: string;
        values: number[];
        labels: string[];
        unit: string;
      }
    > = {};

    // Only fetch widget data for devices in current page
    const deviceIds = channel.devices.map((d) => d.id);
    const pageWidgets = channel.widgets.filter((w) =>
      deviceIds.includes(w.deviceId),
    );

    // Fetch data for each widget in parallel
    await Promise.all(
      pageWidgets.map(async (widget) => {
        if (widget.pinNumber === null || widget.pinNumber === undefined) {
          return;
        }

        // Get the most recent pin history entries for this specific widget's pin
        const recentPinHistory = await prisma.pinHistory.findMany({
          where: {
            deviceId: widget.deviceId,
            pinNumber: widget.pinNumber,
          },
          orderBy: { timestamp: "desc" },
          take: 7, // Get last 7 entries for chart data
        });

        if (recentPinHistory.length > 0) {
          // Reverse to get chronological order (oldest to newest)
          const chronologicalHistory = recentPinHistory.reverse();

          const values = chronologicalHistory.map((ph) => parseFloat(ph.value));
          const labels = chronologicalHistory.map((ph) =>
            new Date(ph.timestamp).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
          );

          widgetData[widget.id] = {
            widgetId: widget.id,
            deviceId: widget.deviceId,
            pinNumber: widget.pinNumber,
            widgetName: widget.name || `Pin ${widget.pinNumber}`,
            values,
            labels,
            unit: (widget.settings as any)?.unit || "",
          };
        }
      }),
    );

    // Get activity data from recent pin history across all devices (not paginated)
    const allRecentPinHistory = await prisma.pinHistory.findMany({
      where: {
        deviceId: { in: deviceIds },
      },
      orderBy: { timestamp: "desc" },
      take: 20, // Get more entries to ensure we have enough for activity feed
      include: {
        device: true,
      },
    });

    // Build activity items
    const activityItems = allRecentPinHistory.slice(0, 10).map((ph) => {
      const now = Date.now();
      const timestamp = new Date(ph.timestamp);
      const timeDiff = now - timestamp.getTime();

      // Determine activity type based on recency (within 5 minutes = active)
      const type = timeDiff < 5 * 60 * 1000 ? "active" : "recent";

      // Find the widget for this pin
      const widget = channel.widgets.find(
        (w) => w.deviceId === ph.deviceId && w.pinNumber === ph.pinNumber,
      );
      const fieldName = widget?.name || `Pin ${ph.pinNumber}`;
      const unit = (widget?.settings as any)?.unit || "";

      return {
        id: ph.id,
        deviceId: ph.deviceId,
        deviceName: ph.device.name,
        fieldName,
        value: parseFloat(ph.value),
        unit,
        timestamp: ph.timestamp.toISOString(),
        type,
      };
    });

    // Format fields with empty dataPoints arrays
    const formattedFields = channel.fields.map((field) => ({
      id: field.id,
      name: field.name,
      description: field.description || "",
      channelId: field.channelId,
      dataPoints: [],
    }));

    // Format devices
    const formattedDevices = channel.devices.map((device) => ({
      id: device.id,
      name: device.name,
      description: device.description || "",
      userId: device.userId,
      channelId: device.channelId,
      status: device.status,
      widgets: device.widgets.map((w) => ({
        widgetId: w.id,
        widgetName: w.name,
        deviceId: w.deviceId,
        pinNumber: w.pinNumber,
        unit: w.unit || "",
      })),
      createdAt: device.createdAt.toISOString(),
      updatedAt: device.updatedAt.toISOString(),
    }));

    const formattedDataPoints = channel.dataPoints.map((dp) => ({
      id: dp.id,
      timestamp: dp.timestamp.toISOString(),
      value: dp.value,
      fieldId: dp.fieldId,
      channelId: dp.channelId,
    }));

    // Total Generated widgets data from pin history schema table
    const totalWidgetsData = await prisma.pinHistory.findMany({
      where: {
        deviceId: { in: deviceIds },
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalDevices / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Build the response
    const response = {
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description || "",
        access: channel.access,
        createdAt: channel.createdAt.toISOString(),
        updatedAt: channel.updatedAt.toISOString(),
        fields: formattedFields,
        dataPoints: formattedDataPoints, // This can be an empty array as per the new structure
        devices: formattedDevices,
        generatedWidgetsData: totalWidgetsData.length, // Total count of generated widgets from pin history
      },
      widgetData,
      activity: activityItems,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalDevices,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  const channel = await prisma.channel.findUnique({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });

  const updatedchannel = await prisma.channel.update({
    where: { id: channel.id },
    data: {
      name: body.name || channel.name,
      description: body.description || channel.description,
      access: body.access || channel.access,
    },
  });

  if (!updatedchannel)
    return NextResponse.json(
      { error: "Failed to update channel" },
      { status: 404 },
    );
  return NextResponse.json(updatedchannel);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.device.deleteMany({
    where: { channelId: params.id },
  });

  await prisma.sampleCodes.deleteMany({
    where: { channelId: params.id },
  });

  await prisma.apiKey.deleteMany({
    where: { channelId: params.id },
  });

  await prisma.dataPoint.deleteMany({
    where: { channelId: params.id },
  });

  await prisma.field.deleteMany({
    where: { channelId: params.id },
  });

  const channel = await prisma.channel.delete({
    where: { id: params.id },
  });

  if (!channel)
    return NextResponse.json({ error: "channel not found" }, { status: 404 });

  return NextResponse.json({ message: "Channel deleted,", channel });
}
