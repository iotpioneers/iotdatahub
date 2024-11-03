import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PaypackJs = require("paypack-js").default;
require("dotenv").config();

const paypack = PaypackJs.config({
  client_id: process.env.PAYPACK_APPLICATION_ID,
  client_secret: process.env.PAYPACK_APPLICATION_SECRET,
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const { pricingId, phoneNumber } = body;

  if (!pricingId) {
    return NextResponse.json(
      { error: "Pricing ID is required" },
      { status: 400 }
    );
  }

  const pricingTier = await prisma.pricingTier.findUnique({
    where: { id: pricingId },
  });

  if (!pricingTier) {
    return NextResponse.json(
      { error: "Pricing tier not found" },
      { status: 404 }
    );
  }

  const payableAmount = pricingTier.price;

  try {
    const response = await paypack.cashin({
      number: phoneNumber,
      amount: payableAmount,
      environment: "development",
    });

    console.log(response.data);

    return NextResponse.json(
      { message: "Payment processed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 }
    );
  }
}
