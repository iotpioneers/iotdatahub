import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subscription = await prisma.pricingTier.findUnique({
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  try {
    const updatedSubscription = await prisma.pricingTier.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        price: body.price,
        maxChannels: body.maxChannels,
        maxMessagesPerYear: body.maxMessagesPerYear,
        features: body.features,
        activation: body.activation,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedSubscription = await prisma.subscription.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedSubscription);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting subscription" },
      { status: 500 }
    );
  }
}
