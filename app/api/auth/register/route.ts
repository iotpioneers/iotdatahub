import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/client";
import { getPricingTier, updateOrCreateSubscription } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || "",
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not created" },
        { status: 500 },
      );
    }

    const newOrganization = await prisma.organization.create({
      data: {
        name: `ORGANIZATION_${Math.random().toString(36).slice(4, 8)}`,
        address: "N/A",
        type: "PERSONAL",
        areaOfInterest: body.interests || ["TECHNOLOGY"],
        userId: user.id,
      },
      include: { users: true },
    });

    const existingMember = await prisma.member.findFirst({
      where: {
        email: user.email,
        organizationId: newOrganization.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        {
          error: "A member with this email already exists in the organization",
        },
        { status: 400 },
      );
    }

    await prisma.member.create({
      data: {
        name: user.name ?? "",
        email: user.email,
        avatar: user.image,
        access: "EDITOR",
        organizationId: newOrganization.id,
        phone: user.phonenumber || "N/A",
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        organizationId: newOrganization.id,
      },
    });

    // Assign a free subscription to the user
    //1. Find a free subscription
    const pricingTier = await getPricingTier("Free Plan");

    if (!pricingTier) {
      throw new Error("Pricing tier not found");
    }

    //2. Update or create a subscription
    const subscription = await updateOrCreateSubscription(user, pricingTier);

    if (!user.subscriptionId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionId: subscription.id },
      });
    }

    return NextResponse.json(
      { message: "User created. Verification email sent.", userId: user.id },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error creating user:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
