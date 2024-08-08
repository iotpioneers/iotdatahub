import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    if (!params.token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Find the verification token in the database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token: params.token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Check if the token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 400 });
    }

    // Update the user's emailVerified field
    const user = await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error verifying email" },
      { status: 500 }
    );
  }
}
