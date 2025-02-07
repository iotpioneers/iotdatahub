import { z } from "zod";
import { WidgetType, WidgetCategory } from "@/types/widgets";

// Password validation function
const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .refine(
    (password) => {
      // Check for at least one uppercase letter
      const hasUppercase = /[A-Z]/.test(password);
      // Check for at least one lowercase letter
      const hasLowercase = /[a-z]/.test(password);
      // Check for at least one number
      const hasNumber = /\d/.test(password);
      // Check for at least one special character
      const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
        password,
      );

      return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    },
    {
      message:
        "Password must include uppercase and lowercase letter, number, and a special character",
    },
  );

// The schema for the user data
export const userSchema = z
  .object({
    name: z.string().max(255).min(1, "Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Must be a valid email"),

    country: z.string().optional(),
    phonenumber: z.string().max(255).min(1, "Phone is required"),
    image: z.string().optional(),
    password: passwordValidation,
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
    emailVerified: z.union([z.date(), z.null()]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// The schema for the forgot password
export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

// The schema for the reset password
export const ResetPasswordSchema = z
  .object({
    currentPassword: passwordValidation,

    newPassword: passwordValidation,

    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// The schema for the channel data
export const channelSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),

  description: z.string().optional(),
  fields: z.array(z.string()).min(1, "At least one field is required"),
  hardware: z
    .enum(["ESP32", "ESP8266", "Arduino", "Raspberry Pi", "Other"])
    .optional(),
  connectionType: z.enum(["WiFi", "Ethernet", "Satellite", "GSM"]).optional(),
  access: z.string().optional(),
});

// The schema for the field data
export const fieldSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),
  channelId: z.string().min(1, "Channel is required"),
  organizationId: z.string().min(1, "Organization is required"),
});

// The schema for the device data
const deviceBaseSchema = {
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),
  description: z.string().nullable().default(null),
  deviceType: z.enum(["SENSOR", "ACTUATOR", "GATEWAY", "CONTROLLER", "OTHER"]),
  model: z.string().optional(),
  firmware: z.string().optional(),
  config: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z
    .string()
    .regex(
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      "Invalid IP address",
    )
    .optional(),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC address")
    .optional(),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
      altitude: z.number().optional(),
    })
    .optional(),
};

// Schema for creating a new device
export const deviceCreateSchema = z.object({
  channelId: z.string().min(1, "Channel is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),
  description: z.string().optional().nullable().default(null),
  deviceType: z.enum(["SENSOR", "ACTUATOR", "GATEWAY", "CONTROLLER", "OTHER"]),
});

// Schema for updating a device
export const deviceUpdateSchema = z
  .object({
    ...deviceBaseSchema,
    status: z
      .enum(["ONLINE", "OFFLINE", "MAINTENANCE", "ERROR", "DISABLED"])
      .optional(),
    batteryLevel: z.number().min(0).max(100).optional(),
    signal: z.number().min(0).max(100).optional(),
  })
  .partial();

// Schema for device automation
export const automationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["SCHEDULED", "CONDITIONAL", "TRIGGER", "SEQUENCE"]),
  condition: z.record(z.any()),
  action: z.record(z.any()),
  schedule: z.string().optional(), // Cron expression
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
});

// Schema for device commands
export const commandSchema = z.object({
  type: z.enum(["POWER", "RESET", "UPDATE", "CONFIGURE", "CUSTOM"]),
  payload: z.record(z.any()),
});

// Schema for maintenance logs
export const maintenanceSchema = z.object({
  type: z.enum(["ROUTINE", "REPAIR", "UPDATE", "INSPECTION", "EMERGENCY"]),
  description: z.string().min(1, "Description is required"),
  performedBy: z.string().optional(),
  scheduledFor: z.string().datetime().optional(),
  notes: z.string().optional(),
});

// Schema for widget data
export const widgetSchema = z.object({
  name: z.string().optional(),
  definition: z
    .object({
      type: z
        .enum([
          "switch",
          "slider",
          "numberInput",
          "imageButton",
          "webPageImage",
          "led",
          "label",
          "gauge",
          "radialGauge",
          "alarmSound",
          "chart",
          "map",
          "imageGallery",
          "customChart",
          "heatmapChart",
          "video",
          "textInput",
          "terminal",
          "segmentedSwitch",
          "menu",
          "modules",
        ])
        .transform((val) => val as WidgetType),

      label: z.string(),
      icon: z.string(),
      defaultSize: z
        .object({
          w: z.number(),
          h: z.number(),
        })
        .transform((val) => JSON.stringify(val)),
      maxSize: z
        .object({
          w: z.number(),
          h: z.number(),
        })
        .optional()
        .transform((val) => (val ? JSON.stringify(val) : undefined)),
      category: z
        .enum(["control", "display", "input", "chart", "media", "misc"])
        .transform((val) => val as WidgetCategory),
    })
    .transform((val) => JSON.stringify(val))
    .optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      width: z.number(),
      height: z.number(),
    })
    .transform((val) => JSON.stringify(val))
    .optional(),
  settings: z
    .record(z.any())
    .transform((val) => JSON.stringify(val))
    .optional(),
});

// The schema for the api keys data
export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required").max(255),

  userId: z.string().min(1, "User is required").max(255),

  channelId: z.string().min(1, "Channel is required").max(255),

  fields: z.array(z.string()).min(1),
});

// The schema for the organization data
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),
  address: z
    .string()
    .min(1, "Address is required")
    .max(255, { message: "Address must be 255 characters or less" })
    .optional(),
  type: z.enum(["PERSONAL", "ENTREPRISE"], {
    message: "Invalid organization type",
  }),
  areaOfInterest: z
    .array(z.string())
    .min(1, "At least one area of interest is required"),
});

// The schema for the enterprise data
export const enterpriseSchema = z.object({
  // Organization Details
  organizationName: z
    .string()
    .min(1, "Organization name is required")
    .max(255, "Organization name must be 255 characters or less"),
  industry: z.enum(["manufacturing", "healthcare", "agriculture", "energy"]),
  employeeCount: z.enum(["<10", "10-50", "50-100", ">100"]),

  // Contact Information
  contactName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name must be 255 characters or less"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(255, "Job title must be 255 characters or less"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),

  // Technical Requirements
  deviceCount: z.string().min(1, "Device count is required"),
});

// The schema for the pricing data
export const pricingPlanSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a non-negative number"),
  type: z.enum(["FREE", "PREMIUM", "ENTERPRISE"], {
    message: "Invalid subscription type",
  }),
  billingCycle: z.enum(["MONTHLY", "YEARLY"], {
    message: "Invalid billing cycle",
  }),
  maxChannels: z.number().min(0, "Max channels must be a non-negative number"),
  maxMessagesPerYear: z
    .number()
    .min(0, "Max messages per year must be a non-negative number"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  activation: z.boolean().optional(),
});

export const AddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  state: z.string(),
  street: z.string(),
});

export const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  address: AddressSchema.optional(),
  access: z.enum(["VIEWER", "COMMENTER", "EDITOR"]),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Payment validation schema
export const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("RWF"),
  type: z.enum(["CREDIT_CARD", "MOBILE_MONEY"]),
  description: z.string().optional(),

  // Credit card fields
  cardLastFour: z.string().length(4).optional(),
  cardExpiryMonth: z.string().length(2).optional(),
  cardExpiryYear: z.string().length(2).optional(),
  cardHolderName: z.string().optional(),

  // Mobile money fields
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,12}$/)
    .optional(),
  provider: z.enum(["MTN", "AIRTEL"]).optional(),

  pricingTierId: z.string(),
  organizationId: z.string().optional(),
});

export const contactSalesSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  workEmail: z.string().email("Invalid email address"),
  jobTitle: z.string().min(1, "Job title is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  expectedUsers: z.string().min(1, "Expected number of users is required"),
  message: z.string(),
  organizationId: z.string().optional(),
});

export const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  organizationId: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
});

export const feedbackReplySchema = z.object({
  message: z.string().min(1, "Message is required"),
  feedbackId: z.string().min(1, "Feedback ID is required"),
});
