import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

interface PaymentData {
  amount: number;
  phoneNumber: string;
  provider: string;
  pricingTier: {
    name: string;
    price: number;
    features: string[];
  };
  user: {
    name: string;
    email: string;
  };
}

const PaypackJs = require("paypack-js").default;
require("dotenv").config();

const paypack = PaypackJs.config({
  client_id: process.env.PAYPACK_APPLICATION_ID,
  client_secret: process.env.PAYPACK_APPLICATION_SECRET,
});

async function sendPaymentRequestEmail(paymentData: PaymentData) {
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

  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 8);

  const paymentEmail = {
    from: process.env.GOOGLE_EMAIL,
    to: paymentData.user.email,
    subject: `Payment Request: ${paymentData.pricingTier.name} Plan`,
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Request</title>
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
          background-color: #1a365d;
          color: #ffffff;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .payment-details {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .warning {
          background-color: #fee2e2;
          color: #991b1b;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
          font-weight: bold;
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
          color: #1a365d;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Request</h1>
        </div>
        <div class="content">
          <p>Dear ${paymentData.user.name},</p>
          
          <p>We have received your request to upgrade to the ${
            paymentData.pricingTier.name
          } plan.</p>
          
          <div class="payment-details">
            <h2>Payment Details</h2>
            <p><span class="highlight">Amount:</span> ${
              paymentData.amount
            } RWF</p>
            <p><span class="highlight">Phone Number:</span> ${
              paymentData.phoneNumber
            }</p>
            <p><span class="highlight">Provider:</span> ${
              paymentData.provider
            }</p>
          </div>

          <div class="warning">
            <p>⚠️ The payment code expires in 8 hours from now! Realize that you are wasting your time if you don't take the time.</p>
            <p>Expiration Time: ${expirationTime.toLocaleString()}</p>
          </div>

          <div class="payment-details">
            <h2>Instructions</h2>
            <p>1. You will receive a prompt on your phone to confirm the payment</p>
            <p>2. Enter your PIN to complete the transaction</p>
            <p>3. Your plan will be automatically upgraded once the payment is confirmed</p>
          </div>

          <p>If you have any questions or need assistance, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>Best regards,</p>
          <p>The IoT Data Hub Team</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  await transporter.sendMail(paymentEmail);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 },
    );
  }

  const userEmail = token.email as string;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { pricingId, phoneNumber, provider } = body;

  if (!pricingId) {
    return NextResponse.json(
      { error: "Pricing ID is required" },
      { status: 400 },
    );
  }

  const pricingTier = await prisma.pricingTier.findUnique({
    where: { id: pricingId },
  });

  if (!pricingTier) {
    return NextResponse.json(
      { error: "Pricing tier not found" },
      { status: 404 },
    );
  }

  const payableAmount = pricingTier.price;

  await paypack
    .cashin({
      number: phoneNumber,
      amount: 100,
      environment: "development",
    })
    .then(async (response: PaymentResponse) => {
      const payment = await prisma.payment.create({
        data: {
          transactionId: response.data.ref,
          userId: user.id,
          amount: payableAmount,
          phoneNumber: phoneNumber,
          provider: provider === "mtn" ? "MTN" : "AIRTEL",
          currency: "RWF",
          type: "MOBILE_MONEY",
          pricingTierId: pricingTier.id,
          organizationId: user.organizationId,
        },
      });

      // Send payment request email
      await sendPaymentRequestEmail({
        amount: payableAmount,
        phoneNumber,
        provider: provider === "mtn" ? "MTN" : "AIRTEL",
        pricingTier: {
          name: pricingTier.name,
          price: pricingTier.price,
          features: pricingTier.features as string[],
        },
        user: {
          name: user.name ?? "",
          email: user.email,
        },
      });

      return NextResponse.json(payment, { status: 201 });
    })
    .catch((error: any) => {
      console.log("Error processing payment:", error);
      return NextResponse.json(
        { error: "Error processing payment" },
        { status: 500 },
      );
    });
}
