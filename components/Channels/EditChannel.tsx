"use client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { Dialog, Button, Flex } from "@radix-ui/themes";
import React from "react";

import { ChangeEvent, useState } from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { channelSchema } from "@/validations/schema.validation";
import ErrorMessage from "@/components/ErrorMessage";
import Loading from "@/app/loading";

type ChannelForm = z.infer<typeof channelSchema>;

const EditChannel = () => {
  const router = useRouter();
  const [fields, setFields] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/channels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("Failed to create channel");
        console.error("Error data:", errorData);
        throw new Error("Failed to create channel");
      }

      const result = await response.json();
      if (result) router.push(`/dashboard/channels/${result.id}`);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
      console.error("Error creating channel:", error);
    }
  });

  if (isSubmitting) return <Loading />;

  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>
            <PencilIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Edit
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Edit your channel</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Make changes to your channel.
          </Dialog.Description>
          <form>
            <Flex direction="column" gap="3">
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
                    <ErrorMessage>
                      {errors.fields?.[index]?.message}
                    </ErrorMessage>
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
                className="inline-flex justify-center rounded-md"
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
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  Edit Channel
                </Button>
              </Dialog.Close>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default EditChannel;
