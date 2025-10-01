import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { channelSchema } from "@/validations/schema.validation";
import { ApiKey } from "@/types/uni-types";

interface Field {
  name: string;
  organization: { connect: { id: string } };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  // Check if the user is authenticated
  if (!token) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userEmail = token.email as string;

  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { subscription: { include: { pricingTier: true } } },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let maxChannels = user.subscription?.pricingTier.maxChannels || 0;

  // Check if the user has an active subscription
  if (!user.subscription || user.subscription.status !== "ACTIVE") {
    maxChannels = 5;
  }

  // Get the user's current channel count
  const userChannelCount = await prisma.channel.count({
    where: { userId: user.id },
  });

  // Check if the user has reached their channel limit
  if (userChannelCount >= maxChannels) {
    return NextResponse.json(
      {
        error:
          "Channel limit reached for your subscription tier, please upgrade your subscription",
      },
      { status: 403 }
    );
  }

  // Validate the request body against the schema
  const validation = channelSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, description, fields } = validation.data;
  const { organizationId } = body;

  // Generate a new valid ObjectID for apiKey
  let apiKey: string;
  let existingApiKey: ApiKey | null;

  do {
    apiKey = new ObjectId().toString();
    existingApiKey = await prisma.apiKey.findUnique({
      where: { apiKey },
    });
  } while (existingApiKey);

  try {
    // Format the fields data as Prisma expects
    const formattedFields: Field[] | undefined = fields?.map(
      (fieldName: string) => ({
        name: fieldName,
        organization: { connect: { id: organizationId } },
      })
    );

    // Create a new channel
    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        organizationId,
        userId: user.id,
        fields: {
          create: formattedFields || [],
        },
        apiKeys: {
          create: {
            apiKey,
            userId: user.id,
            fields: formattedFields?.map((field) => field.name) || [],
            organizationId,
          },
        },
      },
      include: { user: true },
    });

    if (!newChannel) {
      return NextResponse.json(
        { error: "Error creating channel" },
        { status: 500 }
      );
    }

    // Update the user's channels array
    await prisma.user.update({
      where: { id: user.id },
      data: { channels: { connect: { id: newChannel.id } } },
    });

    // Return the new channel and sample codes
    return NextResponse.json({ newChannel }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating channel" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
  if (!token) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 404 }
    );
  }

  const userEmail = token.email as string;

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error("You must be logged in");
  }

  // Fetch channels owned by the user
  const OwnerUserChannels = await prisma.channel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch invites for channels where the user is invited
  const UserChannelInvites = await prisma.channelAccess.findMany({
    where: { userEmail: userEmail },
    include: {
      channel: true,
    },
  });

  // Return an error if no owned channels or invites exist
  if (
    (!OwnerUserChannels || OwnerUserChannels.length === 0) &&
    (!UserChannelInvites || UserChannelInvites.length === 0)
  ) {
    return NextResponse.json(
      { error: "No channels found for this user" },
      { status: 404 }
    );
  }

  // Map over the owned channels and add owner details
  const ownedChannels = await Promise.all(
    OwnerUserChannels.map(async (channel) => {
      const channelOwner = await prisma.user.findUnique({
        where: { id: channel.userId },
      });

      return {
        ...channel,
        ownerEmail: channelOwner?.email,
        ownerImage: channelOwner?.image,
      };
    })
  );

  // Map over the invited channels and add invite details
  const invitedChannels = await Promise.all(
    UserChannelInvites.map(async (invite) => {
      const channelOwner = await prisma.user.findUnique({
        where: { id: invite.channel.userId },
      });

      return {
        ...invite.channel,
        ownerEmail: channelOwner?.email,
        ownerImage: channelOwner?.image,
      };
    })
  );

  // Merge owned and invited channels
  const mergedChannels = [...ownedChannels, ...invitedChannels];

  return NextResponse.json(mergedChannels);
}
