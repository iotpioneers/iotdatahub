import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Define a type for the enhanced user data
type EnhancedUserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  devices: number;
  channels: number;
  fields: number;
  dataUploads: number;
  activityTrend: number[];
};

// Helper function to get activity counts for the last 30 days
async function getActivityTrend(userId: string): Promise<number[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get device creations/updates
  const deviceActivities = await prisma.device.groupBy({
    by: ["updatedAt"],
    where: {
      userId: userId,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Get channel creations/updates
  const channelActivities = await prisma.channel.groupBy({
    by: ["updatedAt"],
    where: {
      userId: userId,
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Get field creations/updates
  const fieldActivities = await prisma.field.groupBy({
    by: ["updatedAt"],
    where: {
      channel: {
        userId: userId,
      },
      updatedAt: {
        gte: thirtyDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Get data uploads
  const dataUploadActivities = await prisma.dataPoint.groupBy({
    by: ["createdAt"],
    where: {
      channel: {
        userId: userId,
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    _count: {
      id: true,
    },
  });

  // Combine all activities
  const allActivities = [
    ...deviceActivities.map((a) => ({ date: a.updatedAt, count: a._count.id })),
    ...channelActivities.map((a) => ({
      date: a.updatedAt,
      count: a._count.id,
    })),
    ...fieldActivities.map((a) => ({ date: a.updatedAt, count: a._count.id })),
    ...dataUploadActivities.map((a) => ({
      date: a.createdAt,
      count: a._count.id,
    })),
  ];

  // Aggregate activities by day
  const activityByDay = allActivities.reduce((acc, activity) => {
    const day = activity.date.toISOString().split("T")[0];
    acc[day] = (acc[day] || 0) + activity.count;
    return acc;
  }, {} as Record<string, number>);

  // Create a 30-day trend array
  const trend: number[] = new Array(30).fill(0);
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toISOString().split("T")[0];
    trend[29 - i] = activityByDay[day] || 0;
  }

  return trend;
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;

  const currentUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Only allow admins to access this data
  if (currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    include: {
      devices: true,
      channels: true,
      _count: {
        select: {
          devices: true,
          channels: true,
        },
      },
    },
  });

  if (!users.length) {
    return NextResponse.json({ error: "No users found" }, { status: 404 });
  }

  const enhancedUsers: EnhancedUserData[] = await Promise.all(
    users.map(async (user) => {
      const fields = await prisma.field.count({
        where: {
          channel: {
            userId: user.id,
          },
        },
      });

      const dataUploads = await prisma.dataPoint.count({
        where: {
          channel: {
            userId: user.id,
          },
        },
      });

      const activityTrend = await getActivityTrend(user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        devices: user._count.devices,
        channels: user._count.channels,
        fields,
        dataUploads,
        activityTrend,
      };
    })
  );

  return NextResponse.json(enhancedUsers);
}
