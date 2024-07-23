import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import dynamic from "next/dynamic";

const Login3 = dynamic(() => import("./_components/authentication3/Login3"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const Auth = () => {
  return (
    <div className="mt-8">
      <Login3 />
    </div>
  );
};

export default Auth;
