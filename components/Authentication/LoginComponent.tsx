"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormContainer from "@/components/Authentication/FormContainer";
import FormInput from "@/components/Authentication/FormInput";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast-provider";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const LoginComponent = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isGoogleSign, setIsGoogleSign] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSuccessfulLogin = async () => {
    try {
      const updatedSession = await getSession();
      if (!updatedSession?.user) {
        throw new Error("Session not available");
      }

      // Add a small delay to ensure session is fully updated
      await new Promise((resolve) => setTimeout(resolve, 300));

      const role = updatedSession.user.role;
      let redirectPath = "/dashboard";

      switch (role) {
        case "ADMIN":
          redirectPath = "/admin";
          break;
        case "USER":
          redirectPath = "/dashboard";
          break;
      }

      // Force a hard refresh to ensure all session data is loaded
      window.location.href = redirectPath;
    } catch (error) {
      toast({
        message: "Error during login processing",
        type: "error",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      toast({
        message: "Signing in...",
        type: "loading",
      });

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      if (response?.ok) {
        toast({
          message: "Login successful!",
          type: "success",
        });
        await handleSuccessfulLogin();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleSign(true);
    try {
      toast({
        message: "Signing in with Google...",
        type: "loading",
      });

      const result = await signIn("google", {
        redirect: true,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        await handleSuccessfulLogin();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setIsGoogleSign(false);
    }
  };

  return (
    <div className="mt-24">
      <FormContainer title="Welcome Back" subtitle="Sign in to your account">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email"
            type="email"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <FormInput
            label="Password"
            type="password"
            icon={<Lock className="h-5 w-5 text-gray-400" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full shadow-amber-600 shadow px-6"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="space-y-3">
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full"
              disabled={isGoogleSign}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              {isGoogleSign && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue with Google
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </FormContainer>
    </div>
  );
};

export default LoginComponent;
