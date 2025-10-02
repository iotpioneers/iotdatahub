"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import {
  CircularProgress,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";

type ModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const fetcher = (url: string, query: string) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .catch((error) => new Error(error));

const AssistantModal: React.FC<ModalProps> = ({ open, setOpen }) => {
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR(
    query ? ["/ai", query] : null,
    ([url, q]) => fetcher(url, q),
    { revalidateOnFocus: false }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(message);
    setQuery(message);
  };

  return (
    <div>
      <motion.div
        className="bg-white fixed right-4 bottom-2 z-20 flex flex-col rounded-2xl"
        initial={{ scale: 1, opacity: 0, height: 0, width: 0 }}
        animate={{
          x: open ? -30 : 0,
          y: open ? -30 : 0,
          width: open ? "300px" : 0,
          height: open ? "400px" : 0,
          opacity: 1,
        }}
        transition={{ type: "spring", duration: 2, ease: "easeInOut" }}
      >
        <motion.div
          className="pt-4 flex flex-col pl-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "tween", duration: 2 }}
        >
          <Typography variant="h5" gutterBottom className="text-orange-50">
            Hello There 🖐🏻
          </Typography>
          <Typography variant="body1" className="text-orange-50">
            Ask us anything about IoTDataHub.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2} mr={2}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Send us a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant="outlined"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
              className="bg-orange-50 text-white"
            >
              Submit
            </Button>
          </Box>

          <Box mt={2}>
            {isLoading && <CircularProgress />}

            {error && (
              <Typography color="error">Failed to fetch response</Typography>
            )}

            {data && (
              <Typography variant="body1">Response: {data.result}</Typography>
            )}
          </Box>

          <div
            className="absolute top-4 right-4 text-white cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#000"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AssistantModal;
