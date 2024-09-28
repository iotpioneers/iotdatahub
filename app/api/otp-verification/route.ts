import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { otp } = body;

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 });
    }

    // Find the verification token in the database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token: otp },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if the otp is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Update the user's emailVerified field
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
}
