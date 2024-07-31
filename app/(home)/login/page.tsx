import React from "react";
import AuthUser from "@/components/Auth/authentication3/AuthUser";
import { Metadata } from "next";

const Auth = () => {
  return (
    <div className="mt-10">
      <AuthUser />
    </div>
  );
};

export default Auth;

export const metadata: Metadata = {
  title: "Login - IoTDataHub",
  description: "Signin to your account",
};
