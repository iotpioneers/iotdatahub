import { access } from "fs";
import React from "react";
import { z } from "zod";

// Define the schema for the channel data
const channelSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  deviceId: z.string(),
  fields: z.array(z.string()).optional(),
  access: z.string().optional(),
});
export default channelSchema;
