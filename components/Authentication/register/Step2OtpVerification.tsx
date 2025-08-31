"use client";

import { ChevronLeft, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step2Props {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  verifyOtp: () => void;
  isOTPVerifying: boolean;
  setStep: (step: number) => void;
  handleEmailSubmit: () => Promise<void>;
  isResending: boolean;
  setIsResending: (isResending: boolean) => void;
}

export const Step2OtpVerification = ({
  email,
  otp,
  setOtp,
  verifyOtp,
  isOTPVerifying,
  setStep,
  handleEmailSubmit,
  isResending,
  setIsResending,
}: Step2Props) => (
  <>
    <button
      onClick={() => setStep(1)}
      className="flex items-center text-sm text-gray-600 mb-4"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back
    </button>

    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
    <p className="text-gray-600 mb-6">
      We sent a 6-digit code to <span className="font-medium">{email}</span>
    </p>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification code
        </label>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-center text-xl tracking-widest"
          placeholder="------"
        />
      </div>

      <Button
        onClick={verifyOtp}
        className="w-full shadow shadow-amber-900 px-6"
        disabled={otp.length !== 6 || isOTPVerifying}
      >
        {isOTPVerifying && <Loader className="mr-2 h-5 w-5 animate-spin " />}{" "}
        Verify Code
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t receive a code?{" "}
        <button
          type="button"
          onClick={async () => {
            setIsResending(true);
            await handleEmailSubmit();
          }}
        >
          {isResending && <Loader className="mr-2 h-5 w-5 animate-spin " />}{" "}
          Resend
        </button>
      </p>
    </div>
  </>
);
