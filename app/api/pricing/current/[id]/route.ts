import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: params.id },
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
