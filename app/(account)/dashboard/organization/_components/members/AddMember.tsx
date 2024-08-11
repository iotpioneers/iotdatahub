"use client";

import * as React from "react";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import "easymde/dist/easymde.min.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { memberSchema } from "@/validations/schema.validation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus as PlusIcon } from "@phosphor-icons/react";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Callout } from "@radix-ui/themes";
import { Member, AddMemberProps } from "@/types";
import ErrorMessage from "@/components/ErrorMessage";
import UploadImage from "@/components/UploadImage";

type MemberFormData = z.infer<typeof memberSchema>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxHeight: "100%",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  overflowY: "auto hidden",
};

const accessType = [
  { value: "VIEWER", label: "View" },
  { value: "COMMENTER", label: "Comment" },
  { value: "EDITOR", label: "Edit" },
];

const AddMember: React.FC<AddMemberProps> = ({ onNewMember }) => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [access, setAccess] = useState<"VIEWER" | "COMMENTER" | "EDITOR">(
    "VIEWER"
  );
  const [showResult, setShowResult] = React.useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowResult(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);

      const memberData = {
        ...data,
        image: avatarUrl || "",
      };

      const response = await fetch("/api/organizations/members/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError("Failed to add new member:");
        setError(errorData.error);
        throw new Error(errorData.error);
      }

      const result: Member = await response.json();

      if (result) {
        onNewMember(result);
        setShowResult(true);
        setIsSubmitting(false);
        setTimeout(() => {
          handleClose();
        }, 100);
      }
      setIsSubmitting(false);
    } catch (error: any) {
      setIsSubmitting(false);
      setError(error.message);
    }
  });

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showResult}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Member added successfully
        </Alert>
      </Snackbar>
      <Button
        startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
        variant="outlined"
        onClick={handleOpen}
      >
        Add Member
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a New Member
          </Typography>
          {error && (
            <Callout.Root
              color="red"
              className="h-10 flex justify-center text-center font-semibold items-center rounded-lg bg-red-500 mb-5"
            >
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <Box sx={formStyle}>
            <form noValidate onSubmit={onSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    {...register("name")}
                    required
                  />
                  <ErrorMessage>{errors.name?.message}</ErrorMessage>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    type="email"
                    {...register("email")}
                    required
                  />
                  <ErrorMessage>{errors.email?.message}</ErrorMessage>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Phone"
                    {...register("phone")}
                  />
                  <ErrorMessage>{errors.phone?.message}</ErrorMessage>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Country"
                    {...register("country")}
                  />
                  <ErrorMessage>{errors.country?.message}</ErrorMessage>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    select
                    label="Access"
                    value={access}
                    {...register("access")}
                    onChange={(event) => {
                      const selectedAccess = event.target.value as
                        | "VIEWER"
                        | "COMMENTER"
                        | "EDITOR";
                      setAccess(selectedAccess);
                      setValue("access", selectedAccess); // Update form value
                    }}
                    required
                  >
                    <ErrorMessage>{errors.access?.message}</ErrorMessage>
                    {accessType.map((access) => (
                      <MenuItem key={access.value} value={access.value}>
                        {access.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    Image
                  </Typography>
                  <Box display="flex" alignItems="center">
                    {avatarUrl && (
                      <Avatar
                        src={avatarUrl || ""}
                        alt="Avatar Preview"
                        sx={{ width: 56, height: 56, marginRight: 2 }}
                      />
                    )}
                    <UploadImage onUpload={setAvatarUrl} />
                  </Box>
                  <ErrorMessage>{errors.avatar?.message}</ErrorMessage>
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
                disabled={isSubmitting}
              >
                Add Member
              </Button>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddMember;
