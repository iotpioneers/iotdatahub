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
    switch (event.type) {
      case "charge.succeeded":
        await handleSuccessfulPayment(event.data.object as Stripe.Charge);
        break;
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const charge = await stripe.charges.retrieve(
          paymentIntent.latest_charge as string
        );
        await handleSuccessfulPayment(charge);
        break;
      default:
        return;
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

async function handleSuccessfulPayment(charge: Stripe.Charge) {
  const {
    id: chargeId,
    amount,
    customer,
    payment_method,
    receipt_email,
    billing_details,
  } = charge;

  const user = await findOrCreateUser(
    receipt_email,
    billing_details?.email,
    customer as string
  );
  if (!user) {
    throw new Error("Unable to find or create user");
  }

  const pricingTier = await getPricingTier("Premium Plan");
  if (!pricingTier) {
    throw new Error("Pricing tier not found");
  }

  const subscription = await updateOrCreateSubscription(user, pricingTier);

  if (!user.subscriptionId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionId: subscription.id },
    });
  }

  await createOrUpdateInvoice(
    user.id,
    subscription.id,
    amount,
    payment_method,
    charge.payment_method_details,
    chargeId
  );
}

async function createOrUpdateInvoice(
  userId: string,
  subscriptionId: string,
  amount: number,
  paymentMethod: string | null,
  paymentMethodDetails: Stripe.Charge.PaymentMethodDetails | null,
  chargeId: string
) {
  const paymentMethodType = mapStripePaymentMethodToEnum(
    paymentMethodDetails?.type
  );
  const last4 = (paymentMethodDetails?.card as any)?.last4 || "";

  // Check if an invoice for this charge already exists
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      userId,
      subscriptionId,
      amount: amount / 100,
      paymentMethod: paymentMethod as string,
      stripeChargeId: chargeId, // Add this field to your Invoice model
    },
  });

  if (existingInvoice) {
    // If the invoice exists, update it if necessary
    return await prisma.invoice.update({
      where: { id: existingInvoice.id },
      data: {
        status: "PAID",
        paymentType: paymentMethodType,
        lastFourCardDigits: last4,
        updatedAt: new Date(),
      },
    });
  } else {
    // If the invoice doesn't exist, create a new one
    return await prisma.invoice.create({
      data: {
        userId,
        subscriptionId,
        amount: amount / 100,
        status: "PAID",
        paymentMethod: paymentMethod as string,
        paymentType: paymentMethodType,
        lastFourCardDigits: last4,
        paidAt: new Date(),
        stripeChargeId: chargeId,
      },
    });
  }
}

async function findOrCreateUser(
  receiptEmail?: string | null,
  billingEmail?: string | null,
  customerId?: string
) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            in: [receiptEmail, billingEmail].filter(Boolean) as string[],
          },
        },
        { subscriptionId: customerId },
      ].filter((condition) => Object.keys(condition).length > 0),
    },
  });

  if (user) return user;
  throw new Error("User not found");
}

async function getPricingTier(tierName: string) {
  return await prisma.pricingTier.findFirst({
    where: { name: tierName },
  });
}

async function updateOrCreateSubscription(user: any, pricingTier: any) {
  const currentDate = new Date();
  const subscriptionEndDate = getSubscriptionEndDate(
    currentDate,
    pricingTier.billingCycle
  );

  let subscription = user.subscriptionId
    ? await prisma.subscription.findUnique({
        where: { id: user.subscriptionId },
        include: { pricingTier: true },
      })
    : null;

  if (subscription) {
    return await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: "ACTIVE",
        currentPeriodStart: currentDate,
        currentPeriodEnd: subscriptionEndDate,
      },
      include: { pricingTier: true },
    });
  } else {
    return await prisma.subscription.create({
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
}

function getSubscriptionEndDate(startDate: Date, billingCycle: string): Date {
  const endDate = new Date(startDate);
  switch (billingCycle) {
    case "MONTHLY":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "YEARLY":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      throw new Error(`Unknown billing cycle: ${billingCycle}`);
  }
  return endDate;
}

function mapStripePaymentMethodToEnum(
  stripePaymentMethod: string | undefined
): PaymentMethodType {
  switch (stripePaymentMethod) {
    case "card":
      return PaymentMethodType.CREDIT_CARD;
    case "paypal":
      return PaymentMethodType.PAYPAL;
    case "bank_transfer":
      return PaymentMethodType.BANK_TRANSFER;
    default:
      return PaymentMethodType.CREDIT_CARD;
  }
}
