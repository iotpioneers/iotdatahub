import { z } from "zod";

// The schema for the channel data
export const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required and cannot be empty")
    .max(255, { message: "Name must be 255 characters or less" }),

  description: z
    .string()
    .min(1, "Description is required and cannot be empty")
    .max(500, { message: "Description must be 500 characters or less" }),
  deviceId: z.string(),
  fields: z.array(z.string()).min(1, "At least one field is required"),
  access: z.string().optional(),
});

// The schema for the device data
export const deviceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required and cannot be empty")
    .max(255, { message: "Name must be 255 characters or less" }),

  description: z
    .string()
    .min(1, "Description is required and cannot be empty")
    .max(500, { message: "Description must be 500 characters or less" }),
  channels: z.string().min(1, "At least one channel is required"),
});
