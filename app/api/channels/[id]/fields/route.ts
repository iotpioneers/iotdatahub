// import prisma from "@/prisma/client";
// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function POST(request: NextRequest) {
//   const body = await request.json();
//   const token = await getToken({ req: request });

//   // Check if token is null before proceeding
//   if (!token) {
//     return NextResponse.json(
//       { error: "User not authenticated" },
//       { status: 401 }
//     );
//   }

//   const userEmail = token.email as string;

//   const user = await prisma.user.findUnique({
//     where: { email: userEmail },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const { value, fieldId } = body;

//   if (!value || !fieldId) {
//     return NextResponse.json(
//       { error: "Value and Field ID are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Find the field and related channel
//     const field = await prisma.field.findUnique({
//       where: { id: fieldId },
//       include: { channel: true },
//     });

//     if (!field) {
//       return NextResponse.json({ error: "Field not found" }, { status: 404 });
//     }

//     // Create a new data point
//     const dataPoint = await prisma.dataPoint.create({
//       data: {
//         value,
//         fieldId: field.id,
//         channelId: field.channelId,
//       },
//     });

//     return NextResponse.json(dataPoint, { status: 201 });
//   } catch (error) {
//     console.error("Error creating data point:", error);
//     return NextResponse.json(
//       { error: "Error creating data point" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   const token = await getToken({ req: request });

//   // Check if token is null before proceeding
//   if (!token) {
//     return NextResponse.json(
//       { error: "User not authenticated" },
//       { status: 401 }
//     );
//   }

//   const userEmail = token.email as string;

//   const user = await prisma.user.findUnique({
//     where: { email: userEmail },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const { fieldId } = request.query;

//   if (!fieldId) {
//     return NextResponse.json(
//       { error: "Field ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Retrieve data points for the specified field
//     const dataPoints = await prisma.dataPoint.findMany({
//       where: { fieldId },
//     });

//     if (!dataPoints || dataPoints.length === 0) {
//       return NextResponse.json(
//         { error: "No data points found for this field" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(dataPoints);
//   } catch (error) {
//     console.error("Error retrieving data points:", error);
//     return NextResponse.json(
//       { error: "Error retrieving data points" },
//       { status: 500 }
//     );
//   }
// }
