import React from "react";
import ChannelSettingsForm from "@/components/Forms/ChannelSettingsForm";
import { Channel, Field } from "@/types";

// Material-UI Components
import { Typography, Box, Button, CardActions, Grid } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

interface ChannelSettingsProps {
  fields: Field[] | null;
  channel: Channel | null;
}

const ChannelSettings = ({ fields, channel }: ChannelSettingsProps) => {
  const handleDelete = () => {
    // Logic to delete the channel
    if (channel) {
      console.log(`Deleting channel with id: ${channel.id}`);
      // Implement delete logic here
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Channel Settings Form */}
      <ChannelSettingsForm fields={fields} channel={channel} />

      {/* Action Button */}
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
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete Channel
            </Button>
          </Grid>
        </CardActions>
      </Box>
    </Box>
  );
};

export default ChannelSettings;
