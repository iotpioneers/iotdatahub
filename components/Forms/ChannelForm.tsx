"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSWRConfig } from "swr";

// material-ui
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Project Imports
import ErrorMessage from "@/components/ErrorMessage";
import { useGlobalState } from "@/context/GlobalContext";
import { createChannelRoom } from "@/lib/actions/RoomActions";
import { channelSchema } from "@/validations/schema.validation";

// Icons
import {
  ArchiveBoxXMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

// Types
type ChannelForm = z.infer<typeof channelSchema>;

const fetcher = (url: string, data: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export default function ChannelForm() {
  const { status, data: session } = useSession();
  const { state, fetchCurrentOrganization } = useGlobalState();
  const router = useRouter();

  const [fields, setFields] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  const { mutate } = useSWRConfig();

  if (status !== "loading" && status === "unauthenticated") return null;

  const currentOrganization = state.currentOrganization;
  const { id: userId, email } = session!.user;

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
  } = useForm<ChannelForm>({
    resolver: zodResolver(channelSchema),
  });

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const addNewField = () => {
    if (fields.length < 6) {
      setFields([...fields, ""]);
    }
  };

  const deleteField = (index: number) => {
    if (index !== 0) {
      const newFields = fields.filter((_, i) => i !== index);
      setFields(newFields);
    }
  };

  useEffect(() => {
    fetchCurrentOrganization();
  }, [currentOrganization]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const result = await mutate(
        "/api/channels",
        fetcher("/api/channels", {
          ...data,
          organizationId: currentOrganization!.id,
        }),
        false
      );

      if (!result || "error" in result) {
        setError(result?.error || "Failed to create channel");
        setOpen(true);
        setIsSubmitting(false);
        return;
      }

      const { id: roomId, name: title } = result.newChannel;

      const room = await createChannelRoom({
        roomId,
        userId,
        email,
        title,
      });

      if ("error" in room) {
        setError(room.error);
        setOpen(true);
        setIsSubmitting(false);
        return;
      }
      router.push(`/dashboard/devices`);
      setOpen(true);
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
      setOpen(true);
    } finally {
      setIsSubmitting(false);
      setError("");
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
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error ? error : "Channel created successfully"}
        </Alert>
      </Snackbar>
      <div className="border-t border-gray-200"></div>
      <form className="mt-6" onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="name"
          >
            Channel Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a unique channel name"
            {...register("name")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>

        {fields.map((field, index) => (
          <div className="mb-4 flex items-center" key={index}>
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor={`field${index}`}
              >
                Field {index + 1}
              </label>
              <input
                type="text"
                id={`field${index}`}
                placeholder={`Enter field ${index + 1} value`}
                {...register(`fields.${index}`)}
                value={field}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(index, e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <ErrorMessage>{errors.fields?.[index]?.message}</ErrorMessage>
            </div>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => deleteField(index)}
                className="ml-2 mt-6 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-white-300"
              >
                <ArchiveBoxXMarkIcon
                  className="h-6 w-6 flex-none text-gray-500"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        ))}

        <Button
          type="button"
          className="inline-flex bg-slate-400 justify-center rounded-md p-1"
          onClick={addNewField}
          disabled={fields.length >= 6}
        >
          New Field
        </Button>

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
                placeholder="Enter channel description"
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
          className="inline-flex justify-center rounded-md border border-transparent bg-orange-50 py-2 px-4 gap-1 text-sm font-medium items-center text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <svg className="animate-pulse h-5 w-5 -mt-1" viewBox="0 0 21 21">
              <g transform="translate(2.5, 2.5)">
                <CloudArrowUpIcon width={20} height={20} color="white" />
              </g>
            </svg>
          )}
          {isSubmitting ? "Creating a new channel..." : "Add Channel"}
        </Button>
      </form>
    </main>
  );
}
