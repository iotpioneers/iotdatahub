import ForgotPassword from "@/components/Auth/authentication/auth-forms/ForgotPassword";
import { Metadata } from "next";

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Forgot Password",
  description: "Provide account email to restore your forgotten password",
};
