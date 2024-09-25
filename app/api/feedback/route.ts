import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { feedbackSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const validation = feedbackSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, email, subject, message, organizationId } = validation.data;

  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        name,
        email,
        subject,
        message,
        organizationId,
      },
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { organization: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const feedback = await prisma.feedback.findMany({
    where: { organizationId: user.organizationId },
    include: { replies: true },
  });

  return NextResponse.json(feedback);
}
