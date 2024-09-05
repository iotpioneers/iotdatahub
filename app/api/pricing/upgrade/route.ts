import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { PaymentMethodType } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case "charge.succeeded":
        await handleSuccessfulCharge(event.data.object as Stripe.Charge);
        break;
      case "payment_intent.succeeded":
        await handleSuccessfulPaymentIntent(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      case "payment_intent.created":
        await handlePaymentIntentCreated(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulCharge(charge: Stripe.Charge) {
  const {
    id,
    amount,
    customer,
    payment_method,
    receipt_email,
    billing_details,
  } = charge;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            in: [receipt_email, billing_details?.email].filter(
              Boolean
            ) as string[],
          },
        },
        { subscriptionId: customer as string },
      ].filter((condition) => Object.keys(condition).length > 0),
    },
  });

  if (!user) {
    throw new Error("You must be logged in");
  }

  // Find existing subscription or create a new one
  let subscription = user.subscriptionId
    ? await prisma.subscription.findUnique({
        where: { id: user.subscriptionId },
        include: { pricingTier: true },
      })
    : null;

  let pricingTier;

  if (subscription && subscription.pricingTier) {
    pricingTier = subscription.pricingTier;
  } else {
    pricingTier = await prisma.pricingTier.findFirst({
      where: { name: "Premium Plan" },
    });

    if (!pricingTier) {
      console.error("Pricing tier not found");
      return;
    }
  }

  const currentDate = new Date();
  let subscriptionEndDate: Date;

  switch (pricingTier.billingCycle) {
    case "MONTHLY":
      subscriptionEndDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      );
      break;
    case "YEARLY":
      subscriptionEndDate = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      );
      break;
    default:
      console.error("Unknown billing cycle:", pricingTier.billingCycle);
      return;
  }

  if (subscription) {
    // Update existing subscription
    subscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: currentDate,
        currentPeriodEnd: subscriptionEndDate,
      },
      include: { pricingTier: true }, // Include pricingTier in the update result
    });
  } else {
    // Create new subscription
    subscription = await prisma.subscription.create({
      data: {
        status: "ACTIVE",
        currentPeriodStart: currentDate,
        currentPeriodEnd: subscriptionEndDate,
        type: pricingTier.type,
        name: `${pricingTier.name} Subscription`,
        pricingTierId: pricingTier.id,
        users: {
          connect: { id: user.id },
        },
      },
      include: { pricingTier: true },
    });
  }

  if (!user.subscriptionId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionId: subscription.id },
    });
  }

  if (payment_method) {
    const paymentMethodDetails = charge.payment_method_details;
    let paymentMethodType: PaymentMethodType = PaymentMethodType.CREDIT_CARD;

    // Map Stripe payment method type to your PaymentMethodType enum
    switch (paymentMethodDetails?.type) {
      case "card":
        paymentMethodType = PaymentMethodType.CREDIT_CARD;
        break;
      case "paypal":
        paymentMethodType = PaymentMethodType.PAYPAL;
        break;
      case "bank_transfer":
        paymentMethodType = PaymentMethodType.BANK_TRANSFER;
        break;
    }

    const last4 = (paymentMethodDetails?.card as any)?.last4 || "";

    // Create invoice
    await prisma.invoice.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        amount: amount / 100,
        status: "PAID",
        paymentMethod: payment_method as string,
        paymentType: paymentMethodType,
        lastFourCardDigits: last4,
        paidAt: new Date(),
      },
    });
  }

  console.log("Successfully processed charge for user:", user.id);
}

async function handleSuccessfulPaymentIntent(
  paymentIntent: Stripe.PaymentIntent
) {
  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge as string
  );
  await handleSuccessfulCharge(charge);
}

async function handlePaymentIntentCreated(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment intent created:", paymentIntent.id);
}
