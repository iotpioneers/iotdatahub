import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { handleSuccessfulPayment } from "@/lib/pricing";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
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
          paymentIntent.latest_charge as string,
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
      { status: 500 },
    );
  }
}
