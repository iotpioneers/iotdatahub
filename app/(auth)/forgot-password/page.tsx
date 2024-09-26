import { Metadata } from "next";
import OnboardingResetPassword from "@/components/Auth/authentication/auth-forms/OnboardingResetPassword";

export default function ForgotPasswordPage() {
  return <OnboardingResetPassword />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Forgot Password",
  description: "Provide account email to restore your forgotten password",
};
