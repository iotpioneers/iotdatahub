"use client";

import { Button } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Heading } from "@radix-ui/themes";
import Image from "next/image";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { FaGoogle } from "react-icons/fa6";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

type FormData = Yup.InferType<typeof schema>;

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const loginUser = async (data: FormData) => {
    setLoading(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
    if (response?.error) {
      console.error("Error", response.error);
      setError(response?.error);
    } else {
      router.push("/dashboard");
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="relative  bg-white  p-6 rounded-md shadow-md max-w-md w-full mx-4 mt-8 mb-0">
        <div className="flex gap-3 text-lime-600">
          <Heading className=" mb-5 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white ">
            Sign in to your account
          </Heading>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-50"></span>
          </span>
        </div>

        {error && (
          <div
            className="bg-red-100 rounded-md border border-red-400 text-red-700 px-4 py-2 mb-4"
            role="alert"
          >
            <span>{error}</span>
          </div>
        )}
        <form className="w-full" onSubmit={handleSubmit(loginUser)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 mt-4 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-0">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-5"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-0">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6  mb-5"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" name="remember" className="mr-2" />
              Remember me
            </label>
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <div className="flex w-full flex-colrounded-lg items-center mt-2">
            <Button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center items-center rounded-lg  bg-blue-600 hover:bg-blue-700  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mb-5"
            >
              {loading ? "Signing you in please wait..." : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="flex items-center py-2">
          <div className="w-full bg-slate-950 h-[1px]"></div>
          <span className="mx-2 text-slate-950">or</span>
          <div className="w-full bg-slate-950 h-[1px]"></div>
        </div>
        <div className="flex items-center  py-2">
          <Button
            type="button"
            className="w-full text-slate-950 bg-slate-400 hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-slate-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center justify-center flex items-center dark:focus:ring-slate-100 mb-4 border border-slate-200"
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
          >
            {/* Icon */}
            <FaGoogle className="mr-2 text-yellow-600 w-4 h-4" />
            Sign in with Google
          </Button>
        </div>
        <div className="flex text-center mt-4">
          <p className="text-sm text-gray-950">
            No account yet?
            <Link
              href="/register"
              className="font-semibold mx-4 leading-6 text-primary-blue hover:text-purple-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
