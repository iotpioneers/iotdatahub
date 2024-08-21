"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
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
import { useGlobalState } from "@/context";
import { createChannelRoom } from "@/lib/actions/room.actions";
import { channelSchema } from "@/validations/schema.validation";
import { Channel, Field } from "@/types";

// Icons
import {
  ArchiveBoxXMarkIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from "@mui/icons-material";

// Types
type ChannelForm = z.infer<typeof channelSchema>;

interface ChannelSettingsFormProps {
  channel: Channel | null;
  fields: Field[] | null;
}

const ChannelSettingsForm = ({ fields, channel }: ChannelSettingsFormProps) => {
  const { status, data: session } = useSession();
  const { state, fetchCurrentOrganization } = useGlobalState();
  const router = useRouter();

  // Initialize state with received props
  const [fieldsState, setFieldsState] = useState<string[]>(
    fields ? fields.map((field) => field.name) : [""]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = React.useState(false);

  if (status !== "loading" && status === "unauthenticated")
    router.push("/login");

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

  const handleSaveChannelChanges = () => {
    // Logic to save channel settings
    console.log("Save button clicked");
  };

  const handleCancelChannelChanges = () => {
    // Logic to cancel changes
    console.log("Cancel button clicked");
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
    newFields[index] = value;
    setFieldsState(newFields);
  };

  const addNewField = () => {
    if (fieldsState.length < 6) {
      setFieldsState([...fieldsState, ""]);
    }
  };

  const deleteField = (index: number) => {
    const newFields = fieldsState.filter((_, i) => i !== index);
    setFieldsState(newFields);
  };

  useEffect(() => {
    fetchCurrentOrganization();
  }, [currentOrganization]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/channels", {
        ...data,
        organizationId: currentOrganization!.id,
      });

      if (response.status !== 201) {
        setError("Failed to create channel");
        throw new Error("Failed to create channel");
      }

      const result = await response.data;

      const { id: roomId, name: title } = result.newChannel;

      const room = await createChannelRoom({
        roomId,
        userId,
        email,
        title,
      });

      if (!room) {
        setError("Failed to create channel");
        setOpen(true);
        setIsSubmitting(false);
        throw new Error("Failed to create channel");
      }
      setOpen(true);

      setIsSubmitting(false);
      setError("");
      router.push(`/dashboard/channels/${room.id}`);
    } catch (error) {
      setIsSubmitting(false);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <main className="overflow-hidden">
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
          {error ? error : "Channel updated successfully"}
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
              render={({ field }) => (
                <SimpleMDE
                  id="description"
                  placeholder="Enter channel description"
                  value={channel!.description || ""}
                  onChange={(value: string) => field.onChange(value)}
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
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 gap-1 text-sm font-medium items-center text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              startIcon={<SaveIcon />}
              onClick={handleSaveChannelChanges}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <svg
                  className="animate-pulse h-5 w-5 -mt-1"
                  viewBox="0 0 21 21"
                >
                  <g transform="translate(2.5, 2.5)">
                    <CloudArrowUpIcon width={20} height={20} color="white" />
                  </g>
                </svg>
              )}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </MainCard>
    </main>
  );
};
export default ChannelSettingsForm;
