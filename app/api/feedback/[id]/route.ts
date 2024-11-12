import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
  }

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
  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
  }

  const body = await request.json();

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
  // Check if the id is a valid ObjectId
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid feedback ID" }, { status: 400 });
  }

  const feedback = await prisma.feedback.delete({
    where: { id: params.id },
  });

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Feedback deleted", feedback });
}
