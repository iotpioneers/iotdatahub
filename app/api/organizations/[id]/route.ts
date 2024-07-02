import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: params.id },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json(
      { error: "Error retrieving organization" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  try {
    const updatedOrganization = await prisma.organization.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address,
        areaOfInterest: body.areaOfInterest,
      },
    });

    return NextResponse.json(updatedOrganization);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating organization" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedOrganization = await prisma.organization.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deletedOrganization);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting organization" },
      { status: 500 }
    );
  }
}
