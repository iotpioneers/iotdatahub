"use client";

import { ChangeEvent, useState } from "react";
import {
  ArchiveBoxXMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { Button, Callout, Flex } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deviceSchema } from "@/validations/schema.validation";
import ErrorMessage from "@/components/ErrorMessage";
import Spinner from "@/components/Spinner";
import BackButton from "@/components/BackButton";

type DeviceForm = z.infer<typeof deviceSchema>;

export default function Newdevice() {
  const router = useRouter();
  const [channel, setChannel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceForm>({
    resolver: zodResolver(deviceSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Data:", data);
      if (data) router.push(`/dashboard/devices/id`);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
      console.error("Error creating device:", error);
    }
  });

  return (
    <main className="overflow-hidden p-4">
      <Flex gap={"3"}>
        <BackButton />
        <h1>Add a new device</h1>
      </Flex>
      <div className="mt-10 border-t border-gray-200"></div>
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="mt-6" onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            device Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a unique device name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>

        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="channel"
            >
              Channel
            </label>
            <input
              type="text"
              id="channel"
              placeholder="Select a channel"
              {...register(`channels`)}
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <ErrorMessage>{errors.channels?.message}</ErrorMessage>
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMDE
                id="description"
                placeholder="Enter device description"
                value={field.value || ""}
                onChange={(value: string) => field.onChange(value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  sm:text-sm"
              />
            )}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <Button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Add device {isSubmitting && <Spinner />}
        </Button>
      </form>
    </main>
  );
}
