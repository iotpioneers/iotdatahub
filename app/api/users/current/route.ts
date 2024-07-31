import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    console.log("Token:", token);

    if (!token) {
      console.log("Token not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userEmail = token.email as string;
    console.log("User Email:", userEmail);

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    console.log("User:", user);

    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
