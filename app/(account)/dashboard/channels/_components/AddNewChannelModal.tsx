"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


import { ArchiveBoxXMarkIcon, CloudArrowUpIcon } from "@heroicons/react/20/solid";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGlobalState } from "@/context";
import { createChannelRoom } from "@/lib/actions/room.actions";
import { revalidatePath } from "next/cache";
import useFetch from "@/hooks/useFetch";
import { LinearLoading } from "@/components/LinearLoading";

// Constants
const hardwareOptions = ["ESP32", "ESP8266", "Arduino", "Raspberry Pi", "Other"]; 
const connectionOptions = ["WiFi", "Ethernet", "Satellite", "GSM"]; 

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().optional(),
  fields: Yup.array()
    .of(Yup.string().required("Field cannot be empty"))
    .min(1, "At least one field is required")
    .max(6, "Maximum 6 fields allowed"),
  connectionType: Yup.string().required("Connection type is required"),
  hardware: Yup.string().required("Hardware is required"),
});

const fetcher = (url: string, data: any) =>
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export default function AddNewChannelModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { status, data: session } = useSession();
  const { state, fetchCurrentOrganization } = useGlobalState();
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [openAlertModal, setOpenAlertModal] = useState(false);

  const { mutate } = useSWRConfig();
    const theme = useTheme();


  if (status !== "loading" && status === "unauthenticated") return <LinearLoading/>;

  const currentOrganization = state.currentOrganization;
  const { id: userId, email } = session!.user;

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlertModal(false);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    height: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 2,
    my: 8,
    mx: 1,
    borderRadius: 2,
  };

  useEffect(() => {
    fetchCurrentOrganization();
  }, [currentOrganization]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const result = await mutate(
        "/api/channels",
        fetcher("/api/channels", {
          ...values,
          organizationId: currentOrganization!.id,
        }),
      { revalidate: true } 
      );

      if (!result || "error" in result) {
        setError(result?.error || "Failed to create channel");
        setOpenAlertModal(true);
        setSubmitting(false);
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
        setOpenAlertModal(true);
        setSubmitting(false);
        return;
      }
      
      router.push(`/dashboard/channels/${roomId}`);
    } catch (error) {
      setError("An unexpected error occurred.");
      onClose();
      setOpenAlertModal(true);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openAlertModal}
        autoHideDuration={6000}
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
      
      <Modal open={open} onClose={onClose} aria-labelledby="modal-title" sx={{py: 2}}>     
        <Box sx={style}>
          <Typography id="modal-title" variant="h1" component="h2" sx={{ my: 2 }}>
            Create New Channel
          </Typography>

          {/* Make a scrollable form */}
          <Box sx={{ overflowY: "auto", maxHeight: "400px" }}>
          
          <Formik
            initialValues={{
              name: "",
              description: "",
              fields: [""],
              connectionType: "WiFi",
              hardware: "ESP8266",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, handleBlur, handleChange }) => (
              <Form className="my-6">
                <FormControl
                  fullWidth
                  error={!!errors.name}
                  sx={{ ...theme.typography.customInput }}

                >
                <InputLabel htmlFor="outlined-adornment-channelname-register">
                          Channel Name
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-channelname-register"
                          type="text"
                          value={values.name}
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{ maxLength: 50 }}
                        />
                        {touched.name && errors.name && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text--register"
                          >
                            {errors.name}
                          </FormHelperText>
                        )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <Field
                    name="hardware"
                    as={TextField}
                    label="Hardware"
                    select
                    fullWidth
                    margin="normal"
                  >
                    {hardwareOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>

                  <Field
                    name="connectionType"
                    as={TextField}
                    label="Connection Type"
                    select
                    fullWidth
                    margin="normal"
                  >
                    {connectionOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Field>
                </Box>

                <FieldArray name="fields">
                  {({ remove, push }) => (
                    <>
                      {values.fields.map((field, index) => (
                        <Box key={index} className="mb-4 flex items-center">
                          
                <FormControl
                  fullWidth
                  error={!!errors.name}
                  sx={{ ...theme.typography.customInput }}

                >
                <InputLabel htmlFor={`outlined-adornment-field${index}-register`}>
                          {`Field ${index + 1}`}
                        </InputLabel>
                        <OutlinedInput
                          id={`outlined-adornment-field${index}-register`}
                          type="text"
                          value={field}
                          name={`fields.${index}`}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        />
                        {touched.fields && errors.fields?.[index] && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text--register"
                          >
                            {errors.fields?.[index]}
                          </FormHelperText>
                        )}
                </FormControl>
                          {index !== 0 && (
                            <Button 
                              type="button" 
                              onClick={() => remove(index)}
                              className="ml-2 mt-2"
                            >
                              <ArchiveBoxXMarkIcon className="h-12 w-12 text-orange-50 hover:text-black" />
                            </Button>
                          )}
                        </Box>
                      ))}
                      <Button
                        type="button"
                        onClick={() => values.fields.length < 6 && push("")}
                        disabled={values.fields.length >= 6}
                        className="inline-flex bg-orange-50  hover:bg-black  text-white justify-center rounded-md p-2 my-2"
                      >
                        New Field
                      </Button>
                    </>
                  )}
                </FieldArray>

                <Field
                  name="description"
                  as={TextField}
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: 128 }}
                  helperText={`${values.description?.length || 0} / 128`}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Button onClick={onClose} variant="outlined">
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-50 py-2 px-4 gap-1 text-sm font-medium items-center text-white shadow-sm hover:bg-orange-700"
                  >
                    {isSubmitting && (
                      <CloudArrowUpIcon width={20} height={20} color="white" />
                    )}
                    {isSubmitting ? "Creating a new channel..." : "Add Channel"}
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          </Box>
        </Box>
      </Modal>
    </>
  );
}