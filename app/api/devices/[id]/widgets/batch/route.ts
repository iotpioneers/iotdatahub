import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

// Validation schemas
const widgetCreateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    type: z.string().optional(), // Made optional
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
    pinConfig: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    // Custom validation to ensure either type or definition.type exists
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
    console.log("Batch operation payload:", JSON.stringify(body, null, 2));
    console.log("====================================");

    const validation = batchPayloadSchema.safeParse(body);

    console.log("====================================");
    console.log(
      "Batch operation validation result:",
      JSON.stringify(validation, null, 2),
    );
    console.log("====================================");

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

    // Ensure type is set for all create operations
    create = create.map((item) => ({
      ...item,
      type: item.type || item.definition?.type || "unknown",
    }));

    const result: BatchResult = {
      successful: 0,
      failed: 0,
      errors: [],
      created: [],
      updated: [],
      deleted: [],
    };

    // Pre-validate all widgets exist for updates/deletes
    if (update.length > 0 || deleteIds.length > 0) {
      const allIds = [...update.map((u) => u.id), ...deleteIds];
      const existingWidgets = await prisma.widget.findMany({
        where: {
          id: { in: allIds },
          deviceId: params.id,
        },
        select: { id: true },
      });

      const existingIds = new Set(existingWidgets.map((w) => w.id));

      console.log("====================================");
      console.log(
        "Existing widgets:",
        JSON.stringify(existingWidgets, null, 2),
      );
      console.log("====================================");

      // Filter out non-existent widgets to avoid transaction failures
      const validUpdates = update.filter((u) => {
        if (!existingIds.has(u.id)) {
          result.errors.push({
            operation: "UPDATE",
            error: "Widget not found",
            id: u.id,
          });
          result.failed++;
          return false;
        }
        return true;
      });

      const validDeletes = deleteIds.filter((id) => {
        if (!existingIds.has(id)) {
          result.errors.push({
            operation: "DELETE",
            error: "Widget not found",
            id,
          });
          result.failed++;
          return false;
        }
        return true;
      });

      // Process operations in optimized batches with longer timeout
      try {
        await prisma.$transaction(
          async (tx) => {
            // 1. Handle deletions first (bulk delete for efficiency)
            if (validDeletes.length > 0) {
              try {
                // Delete pin configs first
                await tx.pinConfig.deleteMany({
                  where: {
                    widgetId: { in: validDeletes },
                    deviceId: params.id,
                  },
                });

                // Delete widgets in bulk
                const deleteResult = await tx.widget.deleteMany({
                  where: {
                    id: { in: validDeletes },
                    deviceId: params.id,
                  },
                });

                result.deleted.push(...validDeletes);
                result.successful += deleteResult.count;
              } catch (error) {
                validDeletes.forEach((id) => {
                  result.errors.push({
                    operation: "DELETE",
                    error:
                      error instanceof Error ? error.message : "Unknown error",
                    id,
                  });
                  result.failed++;
                });
              }
            }

            // 2. Handle updates in bulk
            if (validUpdates.length > 0) {
              for (const updateData of validUpdates) {
                try {
                  const { id, pinConfig, ...widgetUpdateData } = updateData;

                  // Update widget
                  await tx.widget.update({
                    where: { id },
                    data: {
                      ...widgetUpdateData,
                      updatedAt: new Date(),
                    },
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
                    error:
                      error instanceof Error ? error.message : "Unknown error",
                    id: updateData.id,
                  });
                  result.failed++;
                }
              }
            }

            // 3. Handle creations last
            if (create.length > 0) {
              for (const createData of create) {
                try {
                  const {
                    id: tempId,
                    pinConfig,
                    ...widgetCreateData
                  } = createData;

                  // Ensure type is set
                  if (
                    !widgetCreateData.type &&
                    widgetCreateData.definition?.type
                  ) {
                    widgetCreateData.type = widgetCreateData.definition.type;
                  }

                  // Create widget
                  const newWidget = await tx.widget.create({
                    data: {
                      ...widgetCreateData,
                      type: widgetCreateData.type || "unknown",
                      channelId: device.channelId,
                      deviceId: params.id,
                      createdAt: new Date(),
                      updatedAt: new Date(),
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
                    error:
                      error instanceof Error ? error.message : "Unknown error",
                    id: createData.id,
                  });
                  result.failed++;
                }
              }
            }
          },
          {
            maxWait: 10000, // Wait up to 10 seconds to start the transaction
            timeout: 15000, // Allow transaction to run for up to 15 seconds
          },
        );
      } catch (transactionError) {
        console.error("Transaction error:", transactionError);

        // If transaction fails completely, try individual operations
        if (
          transactionError instanceof Error &&
          transactionError.message.includes("Transaction already closed")
        ) {
          console.log(
            "Transaction timeout - falling back to individual operations",
          );

          // Reset results and try individual operations
          result.successful = 0;
          result.failed = 0;
          result.errors = [];
          result.created = [];
          result.updated = [];
          result.deleted = [];

          return await fallbackToIndividualOperations(
            validDeletes,
            validUpdates,
            create,
            params.id,
            device.channelId,
            result,
          );
        } else {
          throw transactionError;
        }
      }
    } else if (create.length > 0) {
      // Only creates - simpler transaction
      await prisma.$transaction(async (tx) => {
        for (const createData of create) {
          try {
            const { id: tempId, pinConfig, ...widgetCreateData } = createData;

            if (!widgetCreateData.type && widgetCreateData.definition?.type) {
              widgetCreateData.type = widgetCreateData.definition.type;
            }

            const newWidget = await tx.widget.create({
              data: {
                ...widgetCreateData,
                type: widgetCreateData.type || "unknown",
                channelId: device.channelId,
                deviceId: params.id,
              },
            });

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
    }

    console.log("Batch operation result:", result);

    // Return appropriate status code
    if (result.failed > 0 && result.successful > 0) {
      return NextResponse.json(result, { status: 207 }); // 207 Multi-Status
    } else if (result.failed > 0) {
      return NextResponse.json(result, { status: 400 }); // All failed
    }

    console.log("====================================");
    console.log("Batch operation completed successfully");
    console.log("====================================");

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

// Fallback function for individual operations when transaction times out
async function fallbackToIndividualOperations(
  deleteIds: string[],
  updateData: any[],
  createData: any[],
  deviceId: string,
  channelId: string,
  result: BatchResult,
) {
  console.log("Processing operations individually...");

  // Handle deletions
  for (const widgetId of deleteIds) {
    try {
      // Delete pin configs first
      await prisma.pinConfig.deleteMany({
        where: { widgetId, deviceId },
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

  // Handle updates
  for (const update of updateData) {
    try {
      const { id, pinConfig, ...widgetUpdateData } = update;

      await prisma.widget.update({
        where: { id },
        data: widgetUpdateData,
      });

      if (pinConfig) {
        const existingPinConfig = await prisma.pinConfig.findFirst({
          where: { widgetId: id },
        });

        if (existingPinConfig) {
          await prisma.pinConfig.update({
            where: { id: existingPinConfig.id },
            data: {
              ...pinConfig,
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.pinConfig.create({
            data: {
              ...pinConfig,
              widgetId: id,
              deviceId,
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
        id: update.id,
      });
      result.failed++;
    }
  }

  // Handle creations
  for (const create of createData) {
    try {
      const { id: tempId, pinConfig, ...widgetCreateData } = create;

      if (!widgetCreateData.type && widgetCreateData.definition?.type) {
        widgetCreateData.type = widgetCreateData.definition.type;
      }

      const newWidget = await prisma.widget.create({
        data: {
          ...widgetCreateData,
          type: widgetCreateData.type || "unknown",
          channelId,
          deviceId,
        },
      });

      if (pinConfig) {
        await prisma.pinConfig.create({
          data: {
            ...pinConfig,
            widgetId: newWidget.id,
            deviceId,
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
        id: create.id,
      });
      result.failed++;
    }
  }

  return result;
}
