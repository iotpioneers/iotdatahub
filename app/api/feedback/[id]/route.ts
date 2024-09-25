import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { feedbackSchema } from "@/validations/schema.validation";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const feedback = await prisma.feedback.findUnique({
    where: { id: params.id },
    include: { replies: true },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json(feedback);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const validation = feedbackSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const feedback = await prisma.feedback.findUnique({
    where: { id: params.id },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  const updatedFeedback = await prisma.feedback.update({
    where: { id: feedback.id },
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      status: body.status,
    },
  });

  return NextResponse.json(updatedFeedback);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const feedback = await prisma.feedback.delete({
    where: { id: params.id },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Feedback deleted", feedback });
}
