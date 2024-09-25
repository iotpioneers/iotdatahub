import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { feedbackReplySchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const feedbackReply = await prisma.feedbackReply.findUnique({
    where: { id: params.id },
    include: { user: true, feedback: true },
  });

  if (!feedbackReply) {
    return NextResponse.json(
      { error: "Feedback reply not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(feedbackReply);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const validation = feedbackReplySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const feedbackReply = await prisma.feedbackReply.findUnique({
    where: { id: params.id },
  });

  if (!feedbackReply) {
    return NextResponse.json(
      { error: "Feedback reply not found" },
      { status: 404 }
    );
  }

  const updatedFeedbackReply = await prisma.feedbackReply.update({
    where: { id: feedbackReply.id },
    data: {
      message: body.message,
    },
  });

  return NextResponse.json(updatedFeedbackReply);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const feedbackReply = await prisma.feedbackReply.delete({
    where: { id: params.id },
  });

  if (!feedbackReply) {
    return NextResponse.json(
      { error: "Feedback reply not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Feedback reply deleted",
    feedbackReply,
  });
}
