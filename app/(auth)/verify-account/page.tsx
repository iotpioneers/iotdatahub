import { Metadata } from "next";
import EmailVerificationComponent from "@/components/Auth/authentication/auth-forms/EmailVerificationComponent";

const EmailVerifyMessage = () => {
  return (
    <div className="mt-8">
      <EmailVerificationComponent />
    </div>
  );
};

export default EmailVerifyMessage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Email Verify",
  description: "Visit your email account to verify the email",
};
