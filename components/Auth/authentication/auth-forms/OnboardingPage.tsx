"use client";

import React, { useState } from "react";
import axios from "axios";

interface EmailVerificationProps {
  onEmailVerified: (email: string) => void;
}

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"email" | "organization">(
    "email"
  );
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleEmailVerified = (email: string) => {
    setUserEmail(email);
    setCurrentStep("organization");
  };

  return (
    <div>
      {currentStep === "email" && (
        <EmailVerification onEmailVerified={handleEmailVerified} />
      )}
    </div>
  );
};

export default OnboardingPage;

const EmailVerification: React.FC<EmailVerificationProps> = ({
  onEmailVerified,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/verification/send", { email });
      onEmailVerified(email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "An error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button type="submit">Send Verification Email</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};
