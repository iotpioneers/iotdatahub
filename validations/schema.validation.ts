import { z } from "zod";

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
        password
      );

      return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    },
    {
      message:
        "Password must include uppercase and lowercase letter, number, and a special character",
    }
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

  description: z
    .string()
    .min(1, "Description is required")
    .max(65535, { message: "Description must be 65535 characters or less" }),
  fields: z.array(z.string()).min(1, "At least one field is required"),
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
export const deviceSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, { message: "Name must be 255 characters or less" }),

  description: z
    .string()
    .min(1, "Description is required")
    .max(65535, { message: "Description must be 65535 characters or less" }),

  channelId: z.string().min(1, "Channel is required"),
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

export const memberSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, {
    message: "Name must be 255 characters or less",
  }),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z.string().optional(),
  country: z.string().optional(),
  avatar: z.string().url("Invalid URL format").optional(),
  access: z.enum(["VIEWER", "COMMENTER", "EDITOR"], {
    message: "Invalid member access",
  }),
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
