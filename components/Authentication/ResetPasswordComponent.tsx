"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormContainer from "@/components/Authentication/FormContainer";
import FormInput from "@/components/Authentication/FormInput";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import PasswordStrength from "@/components/Authentication/PasswordStrength";
import { useSearchParams } from "next/navigation";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ResetPasswordComponent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    // Handle password reset with token
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: data.password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Password reset failed");
    }
  };

  return (
    <FormContainer title="Set New Password">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="New Password"
          type="password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.password?.message}
          {...register("password")}
        />
        {password && <PasswordStrength password={password} />}

        <FormInput
          label="Confirm Password"
          type="password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </FormContainer>
  );
};
export default ResetPasswordComponent;
