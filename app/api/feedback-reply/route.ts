import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { feedbackReplySchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
  const body = await request.json();
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
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const validation = feedbackReplySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { message, feedbackId } = validation.data;

  const feedback = await prisma.feedback.findUnique({
    where: { id: feedbackId },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  try {
    const newFeedbackReply = await prisma.feedbackReply.create({
      data: {
        message,
        feedbackId,
        userId: user.id,
      },
      include: { user: true, feedback: true },
    });

    await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json(newFeedbackReply, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating feedback reply" },
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
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const feedbackReplies = await prisma.feedbackReply.findMany({
    where: { userId: user.id },
    include: { user: true, feedback: true },
  });

  return NextResponse.json(feedbackReplies);
}
