import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface PaymentResponse {
  event_id?: string;
  kind?: string;
  data: {
    ref: string;
    status: string;
    amount: number;
    client?: string;
    provider?: string;
  };
}

interface SuccessPaymentData {
  user: {
    email: string;
    name: string;
  };
  payment: {
    amount: number;
    transactionId: string;
    phoneNumber: string;
    provider: string;
  };
  subscription: {
    name: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
}

async function sendPaymentSuccessEmail(paymentData: SuccessPaymentData) {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const paymentSuccessEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: paymentData.user.email,
    subject: `Payment Successful - Welcome to ${paymentData.subscription.name} Plan!`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Successful</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f5f7fa;
        }
        .container {
          margin: 0 auto;
          width: 600px;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #15803d;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .success-message {
          background-color: #dcfce7;
          color: #15803d;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          text-align: center;
        }
        .transaction-details {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .subscription-details {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #64748b;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          color: #334155;
          margin-top: 0;
        }
        p {
          margin: 8px 0;
          color: #475569;
        }
        .highlight {
          color: #15803d;
          font-weight: bold;
        }
        .checkmark {
          font-size: 48px;
          color: #15803d;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Successful!</h1>
        </div>
        <div class="content">
          <div class="success-message">
            <div class="checkmark">✓</div>
            <p>Thank you for your payment, ${paymentData.user.name}!</p>
          </div>
          
          <div class="transaction-details">
            <h2>Transaction Details</h2>
            <p><span class="highlight">Amount Paid:</span> ${
              paymentData.payment.amount
            } RWF</p>
            <p><span class="highlight">Transaction ID:</span> ${
              paymentData.payment.transactionId
            }</p>
            <p><span class="highlight">Payment Method:</span> ${
              paymentData.payment.provider
            } (${paymentData.payment.phoneNumber})</p>
          </div>

          <div class="subscription-details">
            <h2>Subscription Information</h2>
            <p><span class="highlight">Plan:</span> ${
              paymentData.subscription.name
            }</p>
            <p><span class="highlight">Start Date:</span> ${paymentData.subscription.currentPeriodStart.toLocaleDateString()}</p>
            <p><span class="highlight">End Date:</span> ${paymentData.subscription.currentPeriodEnd.toLocaleDateString()}</p>
          </div>

          <p>Your subscription is now active and you have full access to all features included in your plan.</p>
          
          <p>To start using your subscription:</p>
          <ol>
            <li>Log in to your account</li>
            <li>Explore the new features available to you</li>
            <li>Set up any additional configurations for your organization</li>
          </ol>

          <p>If you have any questions about your subscription or need assistance, our support team is here to help.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing IoT Data Hub!</p>
          <p>The IoT Data Hub Team</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  await transporter.sendMail(paymentSuccessEmail);
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentResponse = await request.json();

    console.log("Payment response:", body);

    const { ref, status } = body.data;

    // Find the existing payment with transaction ID
    const payment = await prisma.payment.findUnique({
      where: { transactionId: ref },
      include: {
        user: true,
        organization: true,
        pricingTier: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (status === "successful") {
      // Use a transaction to ensure all updates succeed or none do
      const updatedPayment = await prisma.$transaction(async (tx) => {
        // 1. Update payment status
        const payment = await tx.payment.update({
          where: { transactionId: ref },
          data: { status: "SUCCEEDED" },
        });

        const pricingTier = await prisma.pricingTier.findUnique({
          where: { id: payment.pricingTierId },
        });

        if (!pricingTier) {
          return NextResponse.json(
            { error: "Pricing tier not found" },
            { status: 404 },
          );
        }

        // 2. Create or update subscription
        const subscription = await tx.subscription.create({
          data: {
            name: pricingTier.name,
            type: pricingTier.type,
            status: "ACTIVE",
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            pricingTierId: payment.pricingTierId,
            organizationId: payment.organizationId || undefined,
            users: {
              connect: { id: payment.userId },
            },
          },
        });

        // Find the user by user ID
        const user = await prisma.user.findUnique({
          where: { id: payment.userId },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Send success email
        await sendPaymentSuccessEmail({
          user: {
            email: user.email,
            name: user.name ?? "",
          },
          payment: {
            amount: payment.amount,
            transactionId: payment.transactionId!,
            phoneNumber: payment.phoneNumber!,
            provider: payment.provider!,
          },
          subscription: {
            name: subscription.name,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
          },
        });

        return payment;
      });

      return NextResponse.json({
        success: true,
        payment: updatedPayment,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Payment was not successful",
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 },
    );
  }
}
