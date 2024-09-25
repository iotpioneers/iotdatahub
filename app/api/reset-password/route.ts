import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ error: "" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's emailVerified field
    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Regitered successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register a user" },
      { status: 500 }
    );
  }
}
