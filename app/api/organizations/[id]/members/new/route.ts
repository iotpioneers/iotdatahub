import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { access } from "fs";
import { memberSchema } from "@/validations/schema.validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const organizationId = params.id;

    // Check if the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
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

    // Parse the request body
    const { name, email, phone, country, avatar, access } = body;

    // Check if the email is already used by a member in the organization
    const existingMember = await prisma.member.findFirst({
      where: {
        email: email,
        organizationId: organizationId,
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

    // Create a new member
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone,
        country,
        avatar,
        access: access || "VIEWER",
        organizationId,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("Error creating member of the organization:", error);
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
