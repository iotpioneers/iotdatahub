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
    console.log("Token:", token);

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new Error("User not found");
    }
    console.log("User:", user);

    // Validate the request body against the schema
    const validation = organizationSchema.safeParse(body);

    if (!validation.success) {
      console.log("Validation Errors:", validation.error.errors);
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { name, address, type, areaOfInterest } = validation.data;
    console.log(
      "name, address, type, areaOfInterest",
      name,
      address,
      type,
      areaOfInterest
    );

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

    console.log("New Organization:", newOrganization);
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.log("Error:", error);
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
