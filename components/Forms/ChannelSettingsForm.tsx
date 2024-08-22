"use client";

import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// material-ui
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Box, Button } from "@mui/material";
import { Card, CardContent, Grid, Typography } from "@mui/material";

// Project Imports
import MainCard from "../dashboard/cards/MainCard";
import ErrorMessage from "@/components/ErrorMessage";
import { channelSchema } from "@/validations/schema.validation";
import { Channel, Field } from "@/types";
import { ActionModal } from "../dashboard/ActionModal";

// Icons
import {
  ArchiveBoxXMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Save as SaveIcon, Add as AddIcon } from "@mui/icons-material";
import LoadingProgressBar from "../LoadingProgressBar";

// Types
type ChannelForm = z.infer<typeof channelSchema>;

interface ChannelSettingsFormProps {
  channel: Channel | null;
  fields: Field[] | null;
}

interface ExtendedField extends Field {
  isNew?: boolean;
}

const ChannelSettingsForm = ({ fields, channel }: ChannelSettingsFormProps) => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [fieldsState, setFieldsState] = useState<ExtendedField[]>(
    fields ? fields.map((field) => ({ ...field, isNew: false })) : []
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  if (status !== "loading" && status === "unauthenticated")
    router.push("/login");

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
    const newFields = [...fieldsState];
    newFields[index].name = value;
    setFieldsState(newFields);
  };

  const addNewField = () => {
    if (fieldsState.length < 6) {
      const newField: ExtendedField = {
        id: `new-${fieldsState.length}`,
        name: "",
        description: "",
        channelId: channel?.id || "",
        organizationId: channel?.organizationId || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isNew: true,
      };
      setFieldsState([...fieldsState, newField]);
    }
  };

  const deleteField = async (index: number) => {
    const fieldToDelete = fieldsState[index];
    if (!fieldToDelete.isNew) {
      // Delete the field from the database
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/field/${fieldToDelete.id}`
        );
        setSuccessMessage(`Field "${fieldToDelete.name}" deleted successfully`);
      } catch (error) {
        setError(`Failed to delete field "${fieldToDelete.name}"`);
        setOpen(true);
        return;
      }
    } else {
      setSuccessMessage("New field removed successfully");
    }

    const newFields = fieldsState.filter((_, i) => i !== index);
    setFieldsState(newFields);
    setOpen(true);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("Form data:", data);
    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channel?.id}`,
        {
          ...data,
          description: data.description || channel?.description,
        }
      );
      console.log("Response:", response); // Debugging line

      if (response.status !== 201) {
        setError("Failed to update channel.");
        setOpen(true);
      } else {
        setSuccessMessage("Channel description updated successfully.");
        router.push(`/dashboard/channels/${channel?.id}`);
      }
    } catch (error) {
      console.error("Error:", error); // Debugging line
      setError("An unexpected error occurred.");
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <main className="overflow-hidden">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>

      {/* Heading */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            justifyContent="center"
            sx={{ mb: 2, gap: 2 }}
          >
            <Typography className="text-3xl font-bold">
              Channel Settings
            </Typography>
            <Typography variant="body1">
              <strong>Access:</strong> {channel?.access || "PUBLIC"}
            </Typography>
          </Grid>
        </CardContent>
      </Card>
      <MainCard>
        <form className="mt-6" onSubmit={onSubmit}>
          {fieldsState.map((field, index) => (
            <div className="mb-4 flex items-center" key={field.id}>
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
                  value={field.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFieldChange(index, e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage>{errors.fields?.[index]?.message}</ErrorMessage>
              </div>
              <ActionModal
                triggerComponent={
                  <button
                    type="button"
                    className="ml-2 mt-6 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-white-300"
                  >
                    <ArchiveBoxXMarkIcon
                      className="h-6 w-6 flex-none text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                }
                title="Delete Field"
                description={`Are you sure you want to delete Field ${
                  index + 1
                }?`}
                warning="This action cannot be undone."
                confirmButtonText="Delete"
                onConfirm={() => deleteField(index)}
                iconSrc="/icons/delete-modal.svg"
              />
            </div>
          ))}

          {/* Add New Field Button */}
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            type="button"
            onClick={addNewField}
            disabled={fieldsState.length >= 6}
          >
            New Field
          </Button>

          <div className="my-4">
            <Controller
              name="description"
              control={control}
              defaultValue={channel?.description || ""}
              render={({ field }) => (
                <SimpleMDE
                  id="description"
                  placeholder="Enter channel description"
                  value={field.value}
                  onChange={field.onChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  sm:text-sm"
                />
              )}
            />
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
          </div>

          {/* Action Buttons */}
          <Box mt={1} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              color="primary"
              className="inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              startIcon={<SaveIcon />}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving Settings..." : "Save Settings"}
            </Button>
            {isSubmitting && <LoadingProgressBar />}
          </Box>
        </form>
      </MainCard>
    </main>
  );
};

export default ChannelSettingsForm;
