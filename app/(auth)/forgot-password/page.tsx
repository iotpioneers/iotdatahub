import ForgotPassword from "@/components/Auth/authentication/auth-forms/ForgotPassword";
import OnboardingResetPassword from "@/components/Auth/authentication/auth-forms/OnboardingResetPassword";
import { Metadata } from "next";

export default function ForgotPasswordPage() {
  return <OnboardingResetPassword />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Forgot Password",
  description: "Provide account email to restore your forgotten password",
};
