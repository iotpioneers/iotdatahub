import ResetPasswordComponent from "@/components/Authentication/ResetPasswordComponent";
import React, { Suspense } from "react";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
};

export default ForgotPasswordPage;
