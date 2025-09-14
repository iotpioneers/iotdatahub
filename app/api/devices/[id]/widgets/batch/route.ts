import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

// Validation schemas (keeping your existing ones)
const pinConfigSchema = z
  .object({
    id: z.string().optional(),
    widgetId: z.string().optional(),
    deviceId: z.string().optional(),
    pinType: z.enum(["VIRTUAL", "GPIO", "DIGITAL", "ANALOG"]).optional(),
    widgetType: z.string().optional(),
    pinNumber: z.string(),
    valueType: z.enum(["BOOLEAN", "NUMBER", "STRING"]),
    defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    title: z.string().optional(),
    showLabels: z.boolean().optional(),
    hideWidgetName: z.boolean().optional(),
    onValue: z.string().optional(),
    offValue: z.string().optional(),
    widgetColor: z.string().optional(),
    automationType: z.string().optional(),
    datastreamName: z.string().optional(),
    datastreamAlias: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .optional();

const widgetCreateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(),
    definition: z
      .object({
        type: z.string(),
      })
      .optional(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
      })
      .optional(),
    settings: z.any().optional(),
    pinConfig: pinConfigSchema,
    pinNumber: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.type && !data.definition?.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either type or definition.type must be provided",
        path: ["type"],
      });
    }
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
  pinConfig: pinConfigSchema,
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

// Helper function to safely extract pin number
function extractPinNumber(pinNumberStr: string | undefined): number | null {
  if (!pinNumberStr) return null;

  // Handle virtual pins like "V4" -> 4
  if (pinNumberStr.startsWith("V")) {
    const num = parseInt(pinNumberStr.substring(1), 10);
    return isNaN(num) ? null : num;
  }

  // Handle regular numbers
  const num = parseInt(pinNumberStr, 10);
  return isNaN(num) ? null : num;
}

// Helper function to safely get pin number from settings
function getPinNumberFromSettings(settings: any): number | null {
  if (!settings) return null;

  // Try different possible property names
  const pinNumberStr = settings.pinNumber || settings.pin || settings.pinId;
  return extractPinNumber(pinNumberStr);
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

    const validation = batchPayloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    let { create, update, delete: deleteIds } = validation.data;

    // Process create operations with safe pin number extraction
    create = create.map((item) => {
      const pinNumber = getPinNumberFromSettings(item.settings);

      const mappedItem: any = {
        ...item,
        type: item.type || item.definition?.type || "unknown",
      };

      // Only add pinNumber if it's defined
      if (pinNumber !== undefined) {
        mappedItem.pinNumber = pinNumber;
      }

      return mappedItem;
    });

    const result: BatchResult = {
      successful: 0,
      failed: 0,
      errors: [],
      created: [],
      updated: [],
      deleted: [],
    };

    // 1. Process DELETIONS first
    if (deleteIds.length > 0) {
      for (const widgetId of deleteIds) {
        try {
          // Check if widget exists
          const existingWidget = await prisma.widget.findFirst({
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

          // Delete pin config first (if exists)
          await prisma.pinConfig.deleteMany({
            where: {
              widgetId: widgetId,
              deviceId: params.id,
            },
          });

          // Delete widget
          await prisma.widget.delete({
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
    }

    // 2. Process UPDATES
    if (update.length > 0) {
      for (const updateData of update) {
        try {
          const { id, pinConfig, ...widgetUpdateData } = updateData;

          // Check if widget exists
          const existingWidget = await prisma.widget.findFirst({
            where: {
              id: id,
              deviceId: params.id,
            },
          });

          if (!existingWidget) {
            result.errors.push({
              operation: "UPDATE",
              error: "Widget not found",
              id: id,
            });
            result.failed++;
            continue;
          }

          // Safely extract pin number for updates
          const pinNumber = getPinNumberFromSettings(widgetUpdateData.settings);

          // Prepare update data
          const updatePayload: any = {
            ...widgetUpdateData,
            updatedAt: new Date(),
          };

          // Only include pinNumber if it's valid
          if (pinNumber !== null) {
            updatePayload.pinNumber = pinNumber;
          }

          // Update widget
          await prisma.widget.update({
            where: { id },
            data: updatePayload,
          });

          // Handle pin config if provided
          if (pinConfig) {
            const {
              id: pinConfigId,
              createdAt,
              updatedAt,
              ...pinConfigData
            } = pinConfig;

            // Find existing pin config
            const existingPinConfig = await prisma.pinConfig.findFirst({
              where: {
                widgetId: id,
                deviceId: params.id,
              },
            });

            if (existingPinConfig) {
              // Update existing
              await prisma.pinConfig.update({
                where: { id: existingPinConfig.id },
                data: {
                  ...pinConfigData,
                  updatedAt: new Date(),
                },
              });
            } else {
              // Create new
              await prisma.pinConfig.create({
                data: {
                  ...pinConfigData,
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
    }

    // 3. Process CREATIONS last
    if (create.length > 0) {
      for (const createData of create) {
        try {
          const { id: tempId, pinConfig, ...widgetCreateData } = createData;

          // Prepare widget data
          const widgetData: any = {
            ...widgetCreateData,
            type: widgetCreateData.type || "unknown",
            channelId: device.channelId,
            deviceId: params.id,
          };

          // Only include pinNumber if it's valid (not undefined)
          if (widgetCreateData.pinNumber !== undefined) {
            widgetData.pinNumber = widgetCreateData.pinNumber;
          }

          // Create widget
          const newWidget = await prisma.widget.create({
            data: widgetData,
          });

          // Handle pin config if provided
          if (pinConfig) {
            const {
              id: pinConfigId,
              createdAt,
              updatedAt,
              ...pinConfigData
            } = pinConfig;

            await prisma.pinConfig.create({
              data: {
                ...pinConfigData,
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
    }

    // Return appropriate status code
    if (result.failed > 0 && result.successful > 0) {
      return NextResponse.json(result, { status: 207 }); // 207 Multi-Status
    } else if (result.failed > 0) {
      return NextResponse.json(result, { status: 400 }); // All failed
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
