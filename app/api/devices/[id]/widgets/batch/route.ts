import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

// Validation schemas
const widgetCreateSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  type: z.string(),
  definition: z.any().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  settings: z.any().optional(),
  pinConfig: z.any().optional(),
});

const widgetUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.string().optional(),
  definition: z.any().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .optional(),
  settings: z.any().optional(),
  pinConfig: z.any().optional(),
});

const batchPayloadSchema = z.object({
  create: z.array(widgetCreateSchema).default([]),
  update: z.array(widgetUpdateSchema).default([]),
  delete: z.array(z.string()).default([]),
});

interface BatchResult {
  successful: number;
  failed: number;
  errors: Array<{
    operation: string;
    error: string;
    id?: string;
  }>;
  created: Array<{ tempId?: string; id: string }>;
  updated: string[];
  deleted: string[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Authentication
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 },
      );
    }

    const userEmail = token.email as string;
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate device exists
    const device = await prisma.device.findUnique({
      where: { id: params.id },
    });

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();

    console.log("====================================");
    console.log("Batch operation payload:", body);
    console.log("====================================");

    // const validation = batchPayloadSchema.safeParse(body);

    // if (!validation.success) {
    //   return NextResponse.json(
    //     {
    //       error: "Validation failed",
    //       details: validation.error.errors,
    //     },
    //     { status: 400 },
    //   );
    // }

    const { create, update, delete: deleteIds } = body;

    const result: BatchResult = {
      successful: 0,
      failed: 0,
      errors: [],
      created: [],
      updated: [],
      deleted: [],
    };

    // Use transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // Handle deletions first
      for (const widgetId of deleteIds) {
        try {
          // Check if widget exists and belongs to this device
          const existingWidget = await tx.widget.findFirst({
            where: {
              id: widgetId,
              deviceId: params.id,
            },
          });

          if (!existingWidget) {
            result.errors.push({
              operation: "DELETE",
              error: "Widget not found",
              id: widgetId,
            });
            result.failed++;
            continue;
          }

          // Delete associated pin config first (if exists)
          await tx.pinConfig.deleteMany({
            where: { widgetId },
          });

          // Delete the widget
          await tx.widget.delete({
            where: { id: widgetId },
          });

          result.deleted.push(widgetId);
          result.successful++;
        } catch (error) {
          result.errors.push({
            operation: "DELETE",
            error: error instanceof Error ? error.message : "Unknown error",
            id: widgetId,
          });
          result.failed++;
        }
      }

      // Handle updates
      for (const updateData of update) {
        try {
          const { id, pinConfig, ...widgetUpdateData } = updateData;

          // Check if widget exists and belongs to this device
          const existingWidget = await tx.widget.findFirst({
            where: {
              id,
              deviceId: params.id,
            },
          });

          if (!existingWidget) {
            result.errors.push({
              operation: "UPDATE",
              error: "Widget not found",
              id,
            });
            result.failed++;
            continue;
          }

          // Update widget
          await tx.widget.update({
            where: { id },
            data: widgetUpdateData,
          });

          // Handle pin config update if provided
          if (pinConfig) {
            const existingPinConfig = await tx.pinConfig.findFirst({
              where: { widgetId: id },
            });

            if (existingPinConfig) {
              await tx.pinConfig.update({
                where: { id: existingPinConfig.id },
                data: {
                  ...pinConfig,
                  updatedAt: new Date(),
                },
              });
            } else {
              await tx.pinConfig.create({
                data: {
                  ...pinConfig,
                  widgetId: id,
                  deviceId: params.id,
                },
              });
            }
          }

          result.updated.push(id);
          result.successful++;
        } catch (error) {
          result.errors.push({
            operation: "UPDATE",
            error: error instanceof Error ? error.message : "Unknown error",
            id: updateData.id,
          });
          result.failed++;
        }
      }

      // Handle creations
      for (const createData of create) {
        try {
          const { id: tempId, pinConfig, ...widgetCreateData } = createData;

          // Ensure type is set
          if (!widgetCreateData.type && widgetCreateData.definition?.type) {
            widgetCreateData.type = widgetCreateData.definition.type;
          }

          // Create widget
          const newWidget = await tx.widget.create({
            data: {
              ...widgetCreateData,
              type: widgetCreateData.type || "unknown",
              channelId: device.channelId,
              deviceId: params.id,
            },
          });

          // Handle pin config creation if provided
          if (pinConfig) {
            await tx.pinConfig.create({
              data: {
                ...pinConfig,
                widgetId: newWidget.id,
                deviceId: params.id,
              },
            });
          }

          result.created.push({
            tempId,
            id: newWidget.id,
          });
          result.successful++;
        } catch (error) {
          result.errors.push({
            operation: "CREATE",
            error: error instanceof Error ? error.message : "Unknown error",
            id: createData.id,
          });
          result.failed++;
        }
      }
    });

    // If there were any failures, include them in the response
    if (result.failed > 0) {
      return NextResponse.json(result, { status: 207 }); // 207 Multi-Status
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in batch widget operation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
