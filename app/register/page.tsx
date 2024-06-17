"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Callout, Heading } from "@radix-ui/themes";
import { userSchema } from "@/validations/schema.validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { ErrorMessage } from "@/components";

type FormData = z.infer<typeof userSchema>;

export default function Register() {
  const [data, SetData] = useState({
    username: "",
    email: "",
    password: "",
  });
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
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (response.ok) {
      route.push("login");
      console.log(result.message);
    } else {
      console.log(result.message);
      setErr(result.message);
    }
  });

  return (
    <div className="h-screen flex justify-center my-10 mx-10 sm:mx-20 rounded-md  mb-10 ">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Heading className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create Account
          </Heading>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* if error display error message */}

          {err && (
            <Callout.Root color="red" className="mb-5">
              <Callout.Text>{err}</Callout.Text>
            </Callout.Root>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  {...register("username")}
                  type="text"
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <ErrorMessage>{errors.username?.message}</ErrorMessage>
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
              <ErrorMessage>{errors.email?.message}</ErrorMessage>
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
              <ErrorMessage>{errors.password?.message}</ErrorMessage>
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
              <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
            </div>

            <div>
              <button className="flex w-full justify-center rounded-md bg-primary-blue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already Have Account
            <Link
              href="login"
              className="font-semibold mx-4 leading-6 text-primary-blue hover:text-blue-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
