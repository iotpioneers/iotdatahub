"use client";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { userSchema } from "@/validations/schema.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { z } from "zod";

type FormData = z.infer<typeof userSchema>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const [open, setOpen] = React.useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const router = useRouter();
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
      setOpen(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      setErr(result.message);
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="relative bg-white p-6 rounded-md shadow-md max-w-md w-full mx-4 mt-8 mb-0">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseResult}
        >
          <Alert
            onClose={handleCloseResult}
            severity={err ? "error" : "success"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {err ? err : "User registered successfully"}
          </Alert>
        </Snackbar>
        <div className="flex gap-3 text-lime-600">
          <Heading className=" mb-5 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create a new account
          </Heading>
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
                {...register("firstname", { required: true })}
                type="text"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.firstname?.message}</p>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              L Name
            </label>
            <div className="mt-1">
              <input
                id="lastname"
                {...register("lastname", { required: true })}
                type="text"
                autoComplete="lastname"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.lastname?.message}</p>
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
                {...register("email", { required: true })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Country
            </label>
            <div className="mt-1">
              <input
                id="country"
                type="country"
                autoComplete="country"
                {...register("country", { required: true })}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone{" "}
            </label>
            <div className="mt-1">
              <input
                id="phone"
                type="text"
                autoComplete="phone"
                {...register("phonenumber", { required: true })}
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
                {...register("password", { required: true })}
                placeholder="••••••••"
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
                {...register("confirmPassword", { required: true })}
                placeholder="••••••••"
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
              className="flex w-full justify-center rounded-md  py-1.5 text-sm font-semibold leading-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {loading ? "Registering you in please wait..." : "Register"}
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
