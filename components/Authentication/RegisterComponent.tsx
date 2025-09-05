"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast-provider";
import { Step1EmailEntry } from "@/components/Authentication/register/Step1EmailEntry";
import { Step2OtpVerification } from "@/components/Authentication/register/Step2OtpVerification";
import { Step3InterestSelection } from "@/components/Authentication/register/Step3InterestSelection";
import { Step4PasswordSetup } from "@/components/Authentication/register/Step4PasswordSetup";

// Step 1: Email entry schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// Step 3: Name and password schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const RegisterComponent = () => {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isCredentialSignIn, setIsCredentialSignIn] = useState<boolean>(false);
  const [isGoogleSign, setIsGoogleSign] = useState(false);
  const [isOTPVerifying, setIsOTPVerifying] = useState(false);
  const [isSavingInterests, setIsSavingInterests] = useState(false);
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // Form for email step
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Form for password step
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const password = watch("password");

  const { data: session } = useSession();

  let callbackUrl = "/dashboard";
  const role = session?.user?.role;

  if (role === "ADMIN") {
    callbackUrl = "/admin";
  }

  // Handle email submission
  const onEmailSubmit = async (data: EmailFormData) => {
    setIsCredentialSignIn(true);
    try {
      toast({
        message: "Sending verification code...",
        type: "loading",
      });

      const response = await fetch("/api/email/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      setEmail(data.email);
      setStep(2);
      toast({
        message: "Verification code sent to your email",
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setIsCredentialSignIn(false);
      setIsResending(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    setIsOTPVerifying(true);
    try {
      toast({
        message: "Verifying code...",
        type: "loading",
      });

      const response = await fetch("/api/email/otpVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid OTP");
      }

      setStep(3);
      toast({
        message: "Email verified successfully!",
        type: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setIsOTPVerifying(false);
    }
  };

  // Handle interest submission
  const handleInterestsSubmit = async () => {
    setIsSavingInterests(true);
    try {
      if (selectedInterests.length < 3) {
        throw new Error("Please select at least 3 interests");
      }

      toast({
        message: "Saving your preferences...",
        type: "loading",
        duration: 2000,
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep(4);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setIsSavingInterests(false);
    }
  };

  // Handle interest selection
  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Handle password submission
  const onAccountSubmit = async (data: PasswordFormData) => {
    setIsRegisteringUser(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: data.name,
          password: data.password,
          interests: selectedInterests,
        }),
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      toast({
        message: "Registration successful!",
        type: "success",
      });
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        toast({
          message: error.message,
          type: "error",
        });
      }
    } finally {
      setIsRegisteringUser(false);
    }
  };

  // Social auth handlers
  const handleGoogleAuth = async () => {
    setIsGoogleSign(true);
    try {
      toast({
        message: "Signing in with Google...",
        type: "loading",
      });

      const result = await signIn("google", {
        callbackUrl: callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        throw new Error(result.error);
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
    <div className="max-w-md mx-auto px-8 py-16 bg-white rounded-xl shadow-lg mt-2.5">
      <div className="flex items-center justify-between mb-8">
        <h1 className="flex items-center justify-center text-3xl font-bold text-red-900 w-full">
          Always IoTDATAHUB
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step1EmailEntry
              handleEmailSubmit={handleEmailSubmit(onEmailSubmit)}
              registerEmail={registerEmail}
              emailErrors={emailErrors}
              isCredentialSignIn={isCredentialSignIn}
              handleGoogleAuth={handleGoogleAuth}
              isGoogleSign={isGoogleSign}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step2OtpVerification
              email={email}
              otp={otp}
              setOtp={setOtp}
              verifyOtp={verifyOtp}
              isOTPVerifying={isOTPVerifying}
              setStep={setStep}
              handleEmailSubmit={handleEmailSubmit(onEmailSubmit)}
              isResending={isResending}
              setIsResending={setIsResending}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step3InterestSelection
              setStep={setStep}
              selectedInterests={selectedInterests}
              toggleInterest={toggleInterest}
              handleInterestsSubmit={handleInterestsSubmit}
              isSavingInterests={isSavingInterests}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Step4PasswordSetup
              setStep={setStep}
              handlePasswordSubmit={handlePasswordSubmit(onAccountSubmit)}
              registerPassword={registerPassword}
              passwordErrors={passwordErrors}
              password={password}
              isRegisteringUser={isRegisteringUser}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-purple-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default RegisterComponent;
