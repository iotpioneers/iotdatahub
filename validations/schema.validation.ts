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
        "Password must include at least one uppercase letter, lowercase letter, number, and a special character",
    }
  );

// The schema for the user data
export const userSchema = z
  .object({
    name: z
      .string()
      .min(1, "Username is required and cannot be empty")
      .max(255, { message: "Username must be 255 characters or less" }),

    email: z
      .string()
      .min(1, "Email is required and cannot be empty")
      .email("Invalid email format"),

    password: passwordValidation,

    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

// The schema for the forgot password
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required and cannot be empty")
    .email("Invalid email format"),
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
    .min(1, "Name is required and cannot be empty")
    .max(255, { message: "Name must be 255 characters or less" }),

  description: z
    .string()
    .min(1, "Description is required and cannot be empty")
    .max(65535, { message: "Description must be 65535 characters or less" }),
  fields: z.array(z.string()).min(1, "At least one field is required"),

  latitude: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().optional()
  ),
  longitude: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().optional()
  ),
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
    .max(65535, { message: "Description must be 65535 characters or less" }),

  channelId: z.string().min(1, "Channel is required and cannot be empty"),
});

// The schema for the api keys data
export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required and cannot be empty").max(255),

  userId: z.string().min(1, "User is required and cannot be empty").max(255),

  channelId: z
    .string()
    .min(1, "Channel is required and cannot be empty")
    .max(255),

  fields: z.array(z.string()).min(1),
});

// The schema for the organization data
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required and cannot be empty")
    .max(255, { message: "Name must be 255 characters or less" }),
  address: z
    .string()
    .min(1, "Address is required and cannot be empty")
    .max(255, { message: "Address must be 255 characters or less" })
    .optional(),
  type: z.enum(["PERSONAL", "ENTREPRISE"], {
    message: "Invalid organization type",
  }),
  areaOfInterest: z.enum(
    [
      "TECHNOLOGY",
      "SCIENCE",
      "HEALTH",
      "FINANCE",
      "EDUCATION",
      "ART",
      "ENVIRONMENT",
      "SPORTS",
      "POLITICS",
      "ENTERTAINMENT",
      "BUSINESS",
      "CULTURE",
      "TRAVEL",
      "FOOD",
    ],
    { message: "Invalid area of interest" }
  ),
});

// The schema for the pricing data
export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required and cannot be empty")
    .max(255, { message: "Name must be 255 characters or less" }),
  description: z.string().optional(),
  type: z.enum(["FREE", "PREMIUM", "ENTERPRISE"], {
    message: "Invalid subscription type",
  }),
  price: z.number().min(0, "Price must be a non-negative number"),
  maxChannels: z.number().min(0, "Max channels must be a non-negative number"),
  maxMessagesPerYear: z
    .number()
    .min(0, "Max messages per year must be a non-negative number"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  activation: z.boolean().optional(),
});

// The schema for the pricing data
