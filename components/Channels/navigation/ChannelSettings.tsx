"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Project Imports
import { deleteChannel } from "@/lib/actions/room.actions";
import ChannelSettingsForm from "@/components/Forms/ChannelSettingsForm";
import { Channel, Field } from "@/types/uni-types";
import LoadingProgressBar from "@/components/loading-progress-bar";
import { ActionModal } from "@/components/dashboard/ActionModal";

// Material-UI Components
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Typography, Box, Button, CardActions, Grid } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface ChannelSettingsProps {
  fields: Field[] | null;
  channel: Channel;
}

const ChannelSettings = ({ fields, channel }: ChannelSettingsProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const router = useRouter();

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowMessage(false);
  };

  // Define the delete function
  const deleteChannelHandler = async () => {
    setLoading(true);

    try {
      const response = await deleteChannel(channel.id);

      if (!response) {
        setError("Failed to delete channel");
        setShowMessage(true);
      }

      setInfo("Channel deleted successfully");
      setShowMessage(true);

      router.push("/dashboard/channels");
    } catch (error) {
      setError("Failed to delete channel");
      setShowMessage(true);
    } finally {
      setLoading(false);
      setShowMessage(true);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {loading && <LoadingProgressBar />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error ? error : info}
        </Alert>
      </Snackbar>

      {/* Channel Settings Form */}
      <ChannelSettingsForm fields={fields} channel={channel} />

      {/* Action Button for Delete with ActionModal */}
      <Box mt={4} justifyContent="flex-start" gap={2}>
        <CardActions>
          <Grid
            container
            direction="column"
            alignItems="flex-start"
            justifyContent="center"
            sx={{ mb: 2, gap: 2 }}
          >
            <Typography className="text-lg font-bold">
              Do you want to delete this channel?
            </Typography>

            <ActionModal
              triggerComponent={
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                >
                  Delete Channel
                </Button>
              }
              title="Delete Channel"
              description={`Are you sure you want to delete the channel "${channel?.name}"? `}
              warning="This action cannot be reversed."
              confirmButtonText="Delete"
              onConfirm={deleteChannelHandler}
              iconSrc="/icons/delete-modal.svg"
            />
          </Grid>
        </CardActions>
      </Box>
    </Box>
  );
};

export default ChannelSettings;
