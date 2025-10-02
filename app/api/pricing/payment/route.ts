import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { paymentSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const validation = paymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const data = validation.data;

    // Validate payment type-specific fields
    if (data.type === "CREDIT_CARD") {
      if (
        !data.cardLastFour ||
        !data.cardExpiryMonth ||
        !data.cardExpiryYear ||
        !data.cardHolderName
      ) {
        return NextResponse.json(
          { error: "Missing required credit card fields" },
          { status: 400 },
        );
      }
    } else if (data.type === "MOBILE_MONEY") {
      if (!data.phoneNumber || !data.provider) {
        return NextResponse.json(
          { error: "Missing required mobile money fields" },
          { status: 400 },
        );
      }
    }

    // Get user from token
    const userEmail = token.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: "PENDING",
        description: data.description,

        // Credit card specific fields
        cardLastFour: data.cardLastFour,
        cardExpiryMonth: data.cardExpiryMonth,
        cardExpiryYear: data.cardExpiryYear,
        cardHolderName: data.cardHolderName,

        // Mobile money specific fields
        phoneNumber: data.phoneNumber,
        provider: data.provider,

        // Relations
        userId: user.id,
        pricingTierId: data.pricingTierId,
        organizationId: data.organizationId,

        // Additional metadata
        metadata: {
          initiatedAt: new Date().toISOString(),
ipAddress: (request.headers.get('x-forwarded-for')) as string,
          userAgent: request.headers.get("user-agent"),
        },
      },
    });

    // Here you would typically integrate with a payment provider
    // For this example, we'll simulate a payment processing delay
    setTimeout(async () => {
      await processPayment(payment.id);
    }, 1000);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }

  const userEmail = token.email as string;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(payments);
}

async function processPayment(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "SUCCEEDED",
          transactionId: `TXN-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        },
      });
    } else {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "FAILED",
          errorMessage: "Payment processing failed",
        },
      });
    }
  } catch (error) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FAILED",
        errorMessage: "Internal server error",
      },
    });
  }
}
