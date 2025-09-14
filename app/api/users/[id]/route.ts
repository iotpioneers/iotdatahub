import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/validations/schema.validation";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();

  const {
    name,
    email,
    country,
    phonenumber,
    image,
    role,
    subscriptionId,
    organizationId,
  } = body;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      email,
      country,
      phonenumber,
      image,
      role,
      subscriptionId,
      organizationId,
    },
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete the user and all related data
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
