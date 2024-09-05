import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { subscriptionSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Validate the request body against the schema
  const validation = subscriptionSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const {
    name,
    description,
    price,
    type,
    billingCycle,
    maxChannels,
    maxMessagesPerYear,
    features,
    activation,
  } = validation.data;

  try {
    const newSubscription = await prisma.pricingTier.create({
      data: {
        name,
        description,
        price,
        type,
        billingCycle,
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
    const subscriptions = await prisma.pricingTier.findMany({});

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
