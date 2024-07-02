import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getToken } from "next-auth/jwt";
import { channelSchema } from "@/validations/schema.validation";

interface Field {
  name: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = await getToken({ req: request });

  // Check if token is null before proceeding
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

  // Validate the request body against the schema
  const validation = channelSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const { name, description, fields } = validation.data;

  const apiKey = nanoid(16);

  try {
    // Format the fields data as Prisma expects
    const formattedFields: Field[] | undefined = fields?.map(
      (fieldName: string) => ({
        name: fieldName,
      })
    );

    const sampleCodes = `
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* server = "YOUR_SERVER_ADDRESS";
String url = "/api/channels/datapoint?api_key=YOUR_API_KEY";

#include <YOUR_WIFI_MODULE.h>  // E.g., ESP8266WiFi, WiFi.h

void setup() {
  Serial.begin(YOUR_BAUD_RATE);  // E.g., 115200
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi!");
}

void sendData(float fieldValues[], int numFields) {
  YOUR_WIFI_CLIENT client;  // E.g., WiFiClient
  if (!client.connect(server, YOUR_PORT)) {  // E.g., 80 for HTTP
    Serial.println("Connection failed");
    return;
  }

  String urlWithData = url;
  for (int i = 0; i < numFields; i++) {
    urlWithData += "&field" + String(i + 1) + "=" + String(fieldValues[i]);
  }

  String httpRequest = "POST " + urlWithData + " HTTP/1.1\\r\\nHost: " + server + "\\r\\n\\r\\n";
  
  client.print(httpRequest);
  delay(10);

  while (client.available()) {
    String line = client.readStringUntil('\\r');
    Serial.print(line);
  }

  Serial.println();
  Serial.println("Data sent successfully");
  client.stop();
}

void loop() {
  float fieldValues[] = {25.0, 30.0}; // Replace with actual data
  int numFields = sizeof(fieldValues) / sizeof(fieldValues[0]);
  sendData(fieldValues, numFields);
  delay(10000); // Send data every 10 seconds
}
`;

    // Create a new channel with formatted fields data and associate it with the user
    const newChannel = await prisma.channel.create({
      data: {
        name,
        description,
        userId: user.id,
        fields: {
          create: formattedFields || [],
        },
        apiKeys: {
          create: {
            apiKey,
            userId: user.id,
            fields: formattedFields?.map((field) => field.name) || [],
            SampleCodes: {
              create: [
                {
                  codes: sampleCodes,
                },
              ],
            },
          },
        },
      },
      include: { user: true },
    });

    // Update the channel's channels array
    await prisma.user.update({
      where: { id: user.id },
      data: { channels: { connect: { id: newChannel.id } } },
    });

    return NextResponse.json({ newChannel, sampleCodes }, { status: 201 });
  } catch (error) {
    console.error("Error creating channel:", error);
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

  const channels = await prisma.channel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!channels || channels.length === 0) {
    return NextResponse.json(
      { error: "No channels found for this user" },
      { status: 404 }
    );
  }

  return NextResponse.json(channels);
}
