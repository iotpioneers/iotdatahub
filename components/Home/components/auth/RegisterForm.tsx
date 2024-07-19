"use client";

import { userSchema } from "@/validations/schema.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormData = z.infer<typeof userSchema>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();

  const route = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      route.push("/dashboard");
      setLoading(false);
    } else {
      setErr(result.message);
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative bg-grey p-6 rounded-md shadow-md max-w-md w-full mx-4 mt-8 mb-0">
        <div className="flex gap-3 text-lime-600">
          <Heading className=" mb-5 text-center">Create Account</Heading>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-50"></span>
          </span>
        </div>

        {err && (
          <div
            className="bg-red-100 rounded-md border border-red-400 text-red-700 px-4 py-2 mb-4"
            role="alert"
          >
            <span>{err}</span>
          </div>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                {...register("name")}
                type="text"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="Repassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-1">
              <input
                id="Repassword"
                type="password"
                {...register("confirmPassword")}
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <div className="flex w-full flex-col space-y-2 border-2 rounded-lg items-center mt-2">
            <Button
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-primary-blue py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {loading ? "Loading..." : "Register"}
            </Button>
          </div>
        </form>
        <div className="flex w-full flex-col space-y-2 border-2 rounded-lg items-center mt-2">
          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl: "http://localhost:3000/dashboard",
              })
            }
            className="flex items-center font-bold hover:text-green-50"
          >
            <p className="flex justify-center items-center gap-3">
              Continue with
              <span className="flex justify-center rounded-md text-sky-400 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:text-slate-50 animate-pulse items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Google
              </span>
            </p>
          </Button>
        </div>
        <div className="flex text-center mt-4">
          <p className="text-sm text-gray-950">
            Already Have Account?
            <Link
              href="/login"
              className="font-semibold mx-4 leading-6 text-primary-blue hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
