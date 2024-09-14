import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { channelSchema } from "@/validations/schema.validation";
import { ApiKey } from "@/types";

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
  });

  if (!user) {
    throw new Error("User not found");
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
    apiKey = new ObjectId().toHexString();
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

    // Sample codes for connecting to the channel
    const sampleCodes = `
    // Sample code to connect to the channel and send data

// WiFi and server configuration
const char* ssid = "YOUR_WIFI_SSID";  // Replace with your WiFi network name
const char* password = "YOUR_WIFI_PASSWORD";  // Replace with your WiFi password
const char* server = "YOUR_SERVER_ADDRESS";  // Replace with your server address
String url = "/api/channels/datapoint?api_key=YOUR_WRITE_API_KEY";  // API endpoint URL

// Include the appropriate WiFi library for your board
#include <YOUR_WIFI_MODULE.h>  // e.g., ESP8266WiFi.h for ESP8266 or WiFi.h for ESP32

// Global variables to store previous sensor readings
float prevFieldValues[2] = {0, 0};  // Adjust the size based on your number of fields

void setup() {
  Serial.begin(115200);  // Start serial communication at 115200 baud rate
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

// Function to send data to the server
void sendData(float fieldValues[], int numFields) {
  YOUR_WIFI_CLIENT client;  // Create a WiFi client instance, e.g., WiFiClient

  // Connect to the server
  if (!client.connect(server, 80)) {  // 80 is the standard HTTP port
    Serial.println("Connection failed");
    return;
  }

  // Construct the URL with data
  String urlWithData = url;
  for (int i = 0; i < numFields; i++) {
    urlWithData += "&field" + String(i + 1) + "=" + String(fieldValues[i]);
  }

  // Create and send the HTTP POST request
  String httpRequest = "POST " + urlWithData + " HTTP/1.1\r\nHost: " + server + "\r\n\r\n";
  client.print(httpRequest);

  // Wait for and print the server's response
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }

  Serial.println("\nData sent successfully");
  client.stop();  // Close the connection
}

// Function to check if there's new data
bool hasNewData(float newValues[], float prevValues[], int numFields, float threshold) {
  for (int i = 0; i < numFields; i++) {
    if (abs(newValues[i] - prevValues[i]) > threshold) {
      return true;  // New data detected
    }
  }
  return false;  // No significant change in data
}

// Function to update previous values
void updatePrevValues(float newValues[], float prevValues[], int numFields) {
  for (int i = 0; i < numFields; i++) {
    prevValues[i] = newValues[i];
  }
}

void loop() {
  // Read sensor data (replace with your actual sensor reading code)
  float fieldValues[] = {
    random(20, 30),  // Simulated temperature reading
    random(40, 60)   // Simulated humidity reading
  };
  int numFields = sizeof(fieldValues) / sizeof(fieldValues[0]);

  // Check if there's new data (using a threshold of 0.5)
  if (hasNewData(fieldValues, prevFieldValues, numFields, 0.5)) {
    sendData(fieldValues, numFields);  // Send data only if there's a change
    updatePrevValues(fieldValues, prevFieldValues, numFields);  // Update previous values
  } else {
    Serial.println("No significant change in data. Skipping API request.");
  }

  delay(10000);  // Wait for 10 seconds before the next reading
}
    `;

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

    // Create SampleCodes using the newly created channel's ID
    const channelSampleCodes = await prisma.sampleCodes.create({
      data: {
        codes: sampleCodes,
        apiKeyId: apiKey,
        channelId: newChannel.id,
        organizationId,
      },
    });

    if (!channelSampleCodes) {
      return NextResponse.json(
        { error: "Error creating sample codes" },
        { status: 500 }
      );
    }

    // Update the user's channels array
    await prisma.user.update({
      where: { id: user.id },
      data: { channels: { connect: { id: newChannel.id } } },
    });

    // Return the new channel and sample codes
    return NextResponse.json({ newChannel, sampleCodes }, { status: 201 });
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
