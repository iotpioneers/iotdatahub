import { z } from "zod";

// Define the schema for the channel data
const channelSchema = z.object({
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
export default channelSchema;
