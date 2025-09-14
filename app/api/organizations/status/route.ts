import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { getPricingTier, updateOrCreateSubscription } from "@/lib/pricing";

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

    let userOrganization = await prisma.organization.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userOrganization) {
      userOrganization = await prisma.organization.create({
        data: {
          name: `ORGANIZATION_${Math.random().toString(36).slice(4, 8)}`,
          address: "N/A",
          type: "PERSONAL",
          areaOfInterest: ["TECHNOLOGY"],
          userId: user.id,
        },
        include: { users: true },
      });

      const existingMember = await prisma.member.findFirst({
        where: {
          email: user.email,
          organizationId: userOrganization.id,
        },
      });

      if (existingMember) {
        return NextResponse.json(
          {
            error:
              "A member with this email already exists in the organization",
          },
          { status: 400 },
        );
      }

      await prisma.member.create({
        data: {
          name: user.name ?? "",
          email: user.email,
          avatar: user.image,
          access: "EDITOR",
          organizationId: userOrganization.id,
          phone: user.phonenumber || "N/A",
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: {
          organizationId: userOrganization.id,
        },
      });

      // Assign a free subscription to the user
      //1. Find a free subscription
      const pricingTier = await getPricingTier("Free Plan");

      if (!pricingTier) {
        throw new Error("Pricing tier not found");
      }

      //2. Update or create a subscription
      const subscription = await updateOrCreateSubscription(user, pricingTier);

      if (!user.subscriptionId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionId: subscription.id },
        });
      }
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
    return NextResponse.json(
      { error: "Error fetching organization status" },
      { status: 500 },
    );
  }
}
