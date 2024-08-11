import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { channelSchema } from "@/validations/schema.validation";

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
  const apiKey = new ObjectId().toHexString();

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
    const char* ssid = "YOUR_WIFI_SSID"; // Replace with your WiFi SSID
    const char* password = "YOUR_WIFI_PASSWORD"; // Replace with your WiFi password
    const char* server = "YOUR_SERVER_ADDRESS"; // Replace with your server address
    String url = "/api/channels/datapoint?api_key=${apiKey}"; 

    #include <YOUR_WIFI_MODULE.h>  // Include the WiFi module library, e.g., ESP8266WiFi, WiFi.h

    void setup() {
      Serial.begin(YOUR_BAUD_RATE);  // Initialize serial communication at a specified baud rate, e.g., 115200
      WiFi.begin(ssid, password);  // Connect to the WiFi network

      // Wait for connection
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
      if (!client.connect(server, YOUR_PORT)) {  // Replace YOUR_PORT with the server port, e.g., 80 for HTTP
        Serial.println("Connection failed");
        return;
      }

      // Append field values to the URL
      String urlWithData = url;
      for (int i = 0; i < numFields; i++) {
        urlWithData += "&field" + String(i + 1) + "=" + String(fieldValues[i]);
      }

      // Create an HTTP POST request
      String httpRequest = "POST " + urlWithData + " HTTP/1.1\\r\\nHost: " + server + "\\r\\n\\r\\n";
      
      // Send the HTTP request
      client.print(httpRequest);
      delay(10);

      // Read and print the response from the server
      while (client.available()) {
        String line = client.readStringUntil('\\r');
        Serial.print(line);
      }

      Serial.println();
      Serial.println("Data sent successfully");
      client.stop();  // Close the connection
    }

    void loop() {
      float fieldValues[] = {25.0, 30.0}; // Replace with actual data
      int numFields = sizeof(fieldValues) / sizeof(fieldValues[0]);
      sendData(fieldValues, numFields);  // Send data
      delay(10000); // Wait for 10 seconds before sending data again
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
    return NextResponse.json({ error: "User not found" }, { status: 404 });
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
