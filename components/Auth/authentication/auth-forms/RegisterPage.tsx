"use client";

import React from "react";
import { Formik, FormikProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

import LoadingProgressBar from "@/components/LoadingProgressBar";
import RegisterForm from "./RegisterForm";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  phonenumber: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  country: Yup.string().required("Country is required"),
  phonenumber: Yup.string().required("Phone number is required"),
});

const RegisterPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    setLoading(true);

    try {
      const response = await axios.post("/api/register", values);
      console.log("Registration successful:", response.data);
      setSubmitting(false);
      router.push("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
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
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        phonenumber: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<FormValues>) => <RegisterForm {...props} />}
    </Formik>
  );
};

export default RegisterPage;
