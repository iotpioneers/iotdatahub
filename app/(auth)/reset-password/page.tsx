import { LinearLoading } from "@/components/LinearLoading";
import ResetPasswordComponent from "@/components/Authentication/ResetPasswordComponent";
import React, { Suspense } from "react";

const ForgotPasswordPage = () => {
  return (
    <Suspense fallback={<LinearLoading />}>
      <ResetPasswordComponent />
    </Suspense>
  );
};

export default ForgotPasswordPage;
