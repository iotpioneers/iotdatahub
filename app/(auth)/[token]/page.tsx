"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Props {
  params: { token: string };
}

const VerifyEmail = ({ params }: Props) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setError("");
    if (!params.token) {
      setError("Invalid verification link.");
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/api/email/verify/${params.token}`);

        if (response.status !== 200) {
          setError(response.statusText);
          setOpen(true);
        }

        setMessage(response.data.message);
        setOpen(true);
        router.push("/feature-creation");
      } catch (err) {
        setError("An error occurred while verifying your email.");
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [params.token]);

  return (
    <>
      {loading && <LoadingSpinner />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {error && error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VerifyEmail;
