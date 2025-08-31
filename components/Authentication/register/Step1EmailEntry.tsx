"use client";

import { Mail, Loader } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/Authentication/FormInput";
import { UseFormRegister, FieldErrors } from "react-hook-form";
interface Step1Props {
  handleEmailSubmit: React.FormEventHandler<HTMLFormElement>;
  registerEmail: UseFormRegister<{ email: string }>;
  emailErrors: FieldErrors<{ email: string }>;
  isCredentialSignIn: boolean;
  handleGoogleAuth: () => void;
  isGoogleSign: boolean;
}

export const Step1EmailEntry = ({
  handleEmailSubmit,
  registerEmail,
  emailErrors,
  isCredentialSignIn,
  handleGoogleAuth,
  isGoogleSign,
}: Step1Props) => (
  <>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">
      Create your account
    </h2>
    <p className="text-gray-600 mb-6">
      Get started with your email or social account
    </p>

    <form onSubmit={handleEmailSubmit} className="space-y-4">
      <FormInput
        label="Email address"
        type="email"
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        error={emailErrors.email?.message}
        {...registerEmail("email")}
      />

      <Button
        type="submit"
        className="w-full shadow-amber-600 shadow px-6"
        variant="secondary"
        disabled={isCredentialSignIn}
      >
        {isCredentialSignIn && (
          <Loader className="mr-2 h-5 w-5 animate-spin " />
        )}{" "}
        Continue with Email
      </Button>
    </form>

    <div className="my-6 flex items-center">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 text-sm text-gray-500">OR</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>

    <div className="space-y-3">
      <Button
        onClick={handleGoogleAuth}
        variant="outline"
        className="w-full"
        disabled={isGoogleSign}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        {isGoogleSign && <Loader className="mr-2 h-5 w-5 animate-spin " />}{" "}
        Continue with Google
      </Button>
    </div>
  </>
);
