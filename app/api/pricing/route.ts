import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { subscriptionSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  // Validate the request body against the schema
  const validation = subscriptionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const {
    name,
    description,
    type,
    price,
    maxChannels,
    maxMessagesPerYear,
    features,
    activation,
  } = validation.data;

  try {
    const newSubscription = await prisma.subscription.create({
      data: {
        name,
        description,
        type,
        price,
        maxChannels,
        maxMessagesPerYear,
        features,
        activation,
      },
    });

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving subscriptions" },
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
    const updatedSubscription = await prisma.subscription.update({
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
