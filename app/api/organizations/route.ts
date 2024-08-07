import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { organizationSchema } from "@/validations/schema.validation";

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 400 }
      );
    }

    // Validate the request body against the schema
    const validation = organizationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { name, address, type, areaOfInterest } = validation.data;

    const newOrganization = await prisma.organization.create({
      data: {
        name,
        address: address || "N/A",
        type,
        areaOfInterest,
        userId: user.id,
      },
      include: { users: true },
    });

    const existingMember = await prisma.member.findFirst({
      where: {
        email: userEmail,
        organizationId: newOrganization.id,
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
        name: user.name,
        email: userEmail,
        avatar: user.image,
        access: "EDITOR",
        organizationId: newOrganization.id,
        phone: user.phonenumber || "N/A",
        country: user.country || "N/A",
      },
    });

    return NextResponse.json({ newOrganization, member }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating organization" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!organizations || organizations.length === 0) {
      return NextResponse.json(
        { error: "No organizations found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organizations);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving organizations" },
      { status: 500 }
    );
  }
}
