"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface OtpModalProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onClose: () => void;
}

export default function OtpModal({
  email,
  onVerify,
  onResend,
  onClose,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    await onResend();
    setIsResending(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
            <MailCheck className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Verify your email
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            We&apos;ve sent a 6-digit code to {email}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification code
          </label>
          <Input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-center text-xl tracking-widest"
            placeholder="------"
          />
        </div>

        <Button
          onClick={() => onVerify(otp)}
          variant="secondary"
          className="w-full mb-4"
          disabled={otp.length !== 6}
        >
          Verify
        </Button>

        <div className="text-center text-sm text-gray-500">
          Didn&apos;t receive a code?{" "}
          <button
            onClick={handleResend}
            className="text-purple-600 hover:underline focus:outline-none"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
