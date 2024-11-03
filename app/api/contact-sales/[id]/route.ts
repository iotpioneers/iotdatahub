import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const contactRequest = await prisma.contactSales.findUnique({
    where: { id: params.id },
    include: { organization: true },
  });

  if (!contactRequest) {
    return NextResponse.json(
      { error: "Contact request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(contactRequest);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const body = await request.json();

  const contactRequest = await prisma.contactSales.findUnique({
    where: { id: params.id },
  });

  if (!contactRequest) {
    return NextResponse.json(
      { error: "Contact request not found" },
      { status: 404 }
    );
  }

  const updatedRequest = await prisma.contactSales.update({
    where: { id: params.id },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json(updatedRequest);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const contactRequest = await prisma.contactSales.delete({
    where: { id: params.id },
  });

  if (!contactRequest) {
    return NextResponse.json(
      { error: "Contact request not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Contact request deleted",
    contactRequest,
  });
}
