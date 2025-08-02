"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormContainer from "@/components/Authentication/FormContainer";
import FormInput from "@/components/Authentication/FormInput";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Handle password reset request
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Password reset failed");
    }
  };

  return (
    <FormContainer
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          variant="secondary"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-center text-sm text-gray-600 mt-4">
          Remembered your password?{" "}
          <Link href="/login" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};
export default ForgotPasswordComponent;
