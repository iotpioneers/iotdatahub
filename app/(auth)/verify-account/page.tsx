import { Metadata } from "next";
import EmailVerificationMessage from "@/components/Auth/authentication/auth-forms/EmailVerificationMessage";

const EmailVerifyMessage = () => {
  return (
    <div className="mt-8">
      <EmailVerificationMessage />
    </div>
  );
};

export default EmailVerifyMessage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Email Verify",
  description: "Visit your email account to verify the email",
};
