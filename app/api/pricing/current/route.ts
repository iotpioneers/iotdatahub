import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    // Check if the user is authenticated
    if (!token) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = token.email as string;

    // First find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Then find the most recent subscription for this user
    const subscription = await prisma.subscription.findFirst({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      include: {
        pricingTier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving subscription" },
      { status: 500 }
    );
  }
}
