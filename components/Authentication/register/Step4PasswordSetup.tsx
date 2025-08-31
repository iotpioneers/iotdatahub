"use client";

import { Lock, User, Loader, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/Authentication/FormInput";
import PasswordStrength from "@/components/Authentication/PasswordStrength";

import { UseFormRegister, FieldErrors } from "react-hook-form";

interface Step4FormValues {
  name: string;
  password: string;
  confirmPassword: string;
}

interface Step4Props {
  setStep: (step: number) => void;
  handlePasswordSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  registerPassword: UseFormRegister<Step4FormValues>;
  passwordErrors: FieldErrors<Step4FormValues>;
  password: string;
  isRegisteringUser: boolean;
}

export const Step4PasswordSetup = ({
  setStep,
  handlePasswordSubmit,
  registerPassword,
  passwordErrors,
  password,
  isRegisteringUser,
}: Step4Props) => (
  <>
    <button
      onClick={() => setStep(3)}
      className="flex items-center text-sm text-gray-600 mb-4"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back
    </button>

    <h2 className="text-2xl font-bold text-gray-900 mb-2">Create a password</h2>
    <p className="text-gray-600 mb-6">
      Secure your account with a strong password
    </p>

    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <FormInput
        label="Name"
        type="text"
        icon={<User className="h-5 w-5 text-gray-400" />}
        error={passwordErrors.name?.message}
        {...registerPassword("name")}
      />

      <FormInput
        label="Password"
        type="password"
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        error={passwordErrors.password?.message}
        {...registerPassword("password")}
      />
      {password && <PasswordStrength password={password} />}

      <FormInput
        label="Confirm Password"
        type="password"
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        error={passwordErrors.confirmPassword?.message}
        {...registerPassword("confirmPassword")}
      />

      <Button
        type="submit"
        className="w-full shadow shadow-amber-900 px-6"
        variant="secondary"
        disabled={isRegisteringUser}
      >
        {isRegisteringUser && <Loader className="mr-2 h-5 w-5 animate-spin" />}
        Complete Registration
      </Button>
    </form>
  </>
);
