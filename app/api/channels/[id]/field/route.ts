import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/prisma/client";
import { fieldSchema } from "@/validations/schema.validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const token = await getToken({ req: request });

    if (!token?.email) {
      return NextResponse.json(
        { error: "You must be logged in to create a field" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: token.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to create a field" },
        { status: 404 },
      );
    }

    const validation = fieldSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.errors },
        { status: 400 },
      );
    }

    const channel = await prisma.channel.findUnique({
      where: { id: params.id },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const updatedChannel = await prisma.channel.update({
      where: { id: channel.id },
      data: {
        fields: {
          create: {
            name: body.name,
            organizationId: channel.organizationId,
          },
        },
      },
      include: {
        fields: true,
      },
    });

    return NextResponse.json({ updatedChannel });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating field" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 404 },
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("You must be logged in");
  }

  const allChannels = await prisma.channel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!allChannels || allChannels.length === 0) {
    return NextResponse.json(
      { error: "No channels found for this user" },
      { status: 404 },
    );
  }

  const channels = await Promise.all(
    allChannels.map(async (channel) => {
      const channelOwner = await prisma.user.findUnique({
        where: { id: channel.userId },
      });

      return {
        ...channel,
        ownerEmail: channelOwner?.email,
        ownerImage: channelOwner?.image,
      };
    }),
  );

  return NextResponse.json(channels);
}
