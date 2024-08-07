import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { memberSchema } from "@/validations/schema.validation";
import { getToken } from "next-auth/jwt";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userEmail = token.email as string;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const organization = await prisma.organization.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const validation = memberSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { name, email, phone, country, avatar, access } = body;

    const existingMember = await prisma.member.findFirst({
      where: {
        email: email,
        organizationId: organization.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        {
          error: "A member with this email already exists in the organization",
        },
        { status: 400 }
      );
    }

    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        country,
        avatar,
        access: access || "VIEWER",
        organizationId: organization.id,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating member of the organization" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = params.id;

    const members = await prisma.member.findMany({
      where: { organizationId: organizationId },
      orderBy: { createdAt: "desc" },
    });

    if (!members || members.length === 0) {
      return NextResponse.json({ error: "No members found" }, { status: 404 });
    }

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving organizations" },
      { status: 500 }
    );
  }
}
