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
      .email("Invalid email format")
      .min(1, "Email is required and cannot be empty"),

    password: passwordValidation,

    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
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
  channels: z.string().min(1, "At least one channel is required"),
});

// The schema for the device data
export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required and cannot be empty").max(255),

  userId: z.string().min(1, "User ID is required and cannot be empty").max(255),

  channelId: z
    .string()
    .min(1, "Channel ID is required and cannot be empty")
    .max(255),

  fields: z.array(z.string()).min(1),
});
