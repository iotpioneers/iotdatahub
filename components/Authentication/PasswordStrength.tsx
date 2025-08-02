"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const calculateStrength = () => {
      let score = 0;
      const newMessages: string[] = [];

      // Length check
      if (password.length >= 8) score += 1;
      else newMessages.push("At least 8 characters");

      // Uppercase check
      if (/[A-Z]/.test(password)) score += 1;
      else newMessages.push("Uppercase letter");

      // Lowercase check
      if (/[a-z]/.test(password)) score += 1;
      else newMessages.push("Lowercase letter");

      // Number check
      if (/\d/.test(password)) score += 1;
      else newMessages.push("Number");

      // Special char check
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      else newMessages.push("Special character");

      setStrength(score);
      setMessages(newMessages);
    };

    calculateStrength();
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 2) return "Weak";
    if (strength === 3) return "Medium";
    return "Strong";
  };

  return (
    <div className="mt-2">
      <div className="flex items-center mb-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(strength / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-2 rounded-full ${getStrengthColor()}`}
          />
        </div>
        <span className="ml-2 text-xs font-medium text-gray-700">
          {getStrengthText()}
        </span>
      </div>
      {messages.length > 0 && (
        <div className="text-xs text-gray-500">
          Needs: {messages.join(", ")}
        </div>
      )}
    </div>
  );
}
