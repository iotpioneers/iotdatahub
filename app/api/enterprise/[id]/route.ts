import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { enterpriseSchema } from "@/validations/schema.validation";
import { getToken } from "next-auth/jwt";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      users: true,
      members: true,
    },
  });

  if (!organization) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(organization);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const validation = enterpriseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const {
      organizationName,
      industry,
      employeeCount,
      contactName,
      jobTitle,
      phone,
      country,
      deviceCount,
    } = validation.data;

    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        name: organizationName,
        industry,
        employeeCount,
        contactName,
        jobTitle,
        phoneNumber: phone,
        country,
        deviceCount,
      },
    });

    return NextResponse.json(updatedOrganization);
  } catch (error) {
    console.error("Update enterprise error:", error);
    return NextResponse.json(
      { error: "Error updating enterprise information" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const organization = await prisma.organization.delete({
      where: { id: params.id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Organization deleted successfully",
      organization,
    });
  } catch (error) {
    console.error("Delete enterprise error:", error);
    return NextResponse.json(
      { error: "Error deleting enterprise" },
      { status: 500 }
    );
  }
}
