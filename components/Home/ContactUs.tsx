"use client";

import { Button, Text } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Heading } from "@radix-ui/themes";
import Image from "next/image";
import {
  ArrowDownTrayIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

type FormData = Yup.InferType<typeof schema>;

const ContactUs = () => {
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
      console.log("Success", response);
      router.push("/dashboard");
    }
  };
  return (
    <div className="flex items-center justify-center m-10">
      <div className="relative bg-white p-6 rounded-md shadow-md max-w-md w-full mx-4 mt-8 mb-0">
        <div className="flex gap-3 text-lime-600">
          <Heading className=" mb-5 text-center">Contact Us</Heading>
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
              htmlFor="firstname"
              className="block text-sm font-medium leading-6 mt-4 text-gray-900"
            >
              First Name
            </label>
            <div className="mt-0">
              <input
                id="firstname"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-5"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium leading-6 mt-4 text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-0">
              <input
                id="lastname"
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-5"
              />
            </div>
          </div>

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
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Address
              </label>
            </div>
            <input
              id="address"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6  mb-5"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="message"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Message
              </label>
            </div>
            <input
              id="message"
              type="text"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6  mb-5"
            />
          </div>

          <div>
            <Button
              disabled={loading}
              type="submit"
              className="flex w-full justify-center items-center rounded-lg bg-gray-950 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mb-5"
            >
              {!loading && (
                <svg
                  className="animate-none h-5 w-5 items-center rounded-full bg-white mr-2"
                  viewBox="0 0 20 20"
                >
                  <g transform="translate(2.5, 2.5)">
                    <ArrowDownTrayIcon width={14} height={14} color="black" />
                  </g>
                </svg>
              )}
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
