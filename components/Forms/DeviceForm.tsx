"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Controller, useForm } from "react-hook-form";
import { Button, Callout, Flex } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deviceSchema } from "@/validations/schema.validation";
import ErrorMessage from "@/components/ErrorMessage";
import BackButton from "@/components/BackButton";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

interface Channel {
  id: string;
  name: string;
  description: string;
}

type DeviceFormData = z.infer<typeof deviceSchema>;

export default function DeviceForm() {
  const router = useRouter();
  const [channel, setChannel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [channels, setChannels] = useState<Channel[] | null>(null);
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
  });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsSubmitting(true);
        const response = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/channels"
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError("Failed to create channel");
          throw new Error("Failed to create channel");
        }
        const channelsData: Channel[] = await response.json();

        setChannels(channelsData);
      } catch (error) {
        return null;
      } finally {
        setIsSubmitting(false);
      }
    };

    fetchChannels();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("Failed to create device");
        throw new Error("Failed to create device");
      }

      const result = await response.json();

      if (result) {
        setOpen(true);
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/dashboard/organization");
        }, 100);
      }
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
    }
  });

  return (
    <main className="overflow-hidden p-4">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Device created successfully
        </Alert>
      </Snackbar>
      <Flex gap={"3"}>
        <h1>Add a new device</h1>
      </Flex>
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
            Device Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a device name"
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
            <select
              id="channelId"
              {...register("channelId")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="" disabled hidden>
                Choose a channel
              </option>
              {channels?.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              ))}
            </select>
            <ErrorMessage>{errors.channelId?.message}</ErrorMessage>
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

        <div className="flex justify-between items-center">
          <BackButton />
          <Button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                className="animate-pulse h-5 w-5 -mt-1 mr-1"
                viewBox="0 0 21 21"
              >
                <g transform="translate(2.5, 2.5)">
                  <CloudArrowUpIcon width={20} height={20} color="white" />
                </g>
              </svg>
            )}
            {isSubmitting ? "Sending..." : "Add device"}
          </Button>
        </div>
      </form>
    </main>
  );
}
