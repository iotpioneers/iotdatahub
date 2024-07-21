import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
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

    const userOrganization = await prisma.organization.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!userOrganization) {
      return NextResponse.json(
        { hasOrganization: false, organization: null },
        { status: 200 }
      );
    }

    const members = await prisma.member.findMany({
      where: { organizationId: userOrganization.id },
    });

    return NextResponse.json(
      {
        hasOrganization: !!userOrganization,
        organization: userOrganization,
        members,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Error fetching organization status" },
      { status: 500 }
    );
  }
}
