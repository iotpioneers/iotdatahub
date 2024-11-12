// C:\Users\emash\IoTDataHub\app\login\page.tsx

"use client";

import React from "react";
import { Formik, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";

import LoadingProgressBar from "@/components/LoadingProgressBar";
import LoginForm from "./LoginForm";

interface FormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (response?.error) {
        console.error("Error logging in:", response.error);
      } else {
        router.push("/dashboard");
      }

      setSubmitting(false);
    } catch (error) {
      console.error("Error logging in:", error);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { redirect: true, callbackUrl: "/dashboard" });
  };

  if (status === "loading") {
    return <LoadingProgressBar />;
  }

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<FormValues>) => (
        <LoginForm {...props} onGoogleSignIn={handleGoogleSignIn} />
      )}
    </Formik>
  );
};

export default LoginPage;
