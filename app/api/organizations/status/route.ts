import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const userEmail = token.email as string;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userOrganization = await prisma.organization.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userOrganization) {
      return NextResponse.json(
        { hasOrganization: false, organization: null },
        { status: 200 },
      );
    }

    const members = await prisma.member.findMany({
      where: { organizationId: userOrganization.id },
    });

    const devices = await prisma.device.findMany({
      where: { organizationId: userOrganization.id },
      select: {
        id: true,
        name: true,
        description: true,
        channelId: true,
        organizationId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    const channels = await prisma.channel.findMany({
      where: { organizationId: userOrganization.id },
    });

    const fields = await prisma.field.findMany({
      where: { organizationId: userOrganization.id },
    });

    const datapoints = await prisma.dataPoint.findMany({
      where: { organizationId: userOrganization.id },
    });

    return NextResponse.json(
      {
        hasOrganization: true,
        organization: userOrganization,
        members,
        devices,
        channels,
        fields,
        datapoints,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error occurred while fetching organization status", error);
    return NextResponse.json(
      { error: "Error fetching organization status" },
      { status: 500 },
    );
  }
}
