"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Snackbar,
  Paper,
  Divider,
  Grid,
  InputAdornment,
  ListItem,
  ListItemText,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import { ApiKey } from "@/types";
import axios from "axios";

interface ApiKeysProps {
  apiKey: ApiKey;
}

const ApiKeys = ({ apiKey: initialApiKey }: ApiKeysProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey.apiKey);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setSnackbarMessage("API key copied to clipboard");
    setShowSnackbar(true);
  };

  const handleGenerateNewApiKey = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/apikey/${initialApiKey.id}`
      );

      console.log("response", response);

      if (response.status === 200) {
        const newApiKey: ApiKey = response.data;
        setApiKey(newApiKey.apiKey);
        setSnackbarMessage("New API key generated");
      } else {
        setSnackbarMessage("Failed to generate new API key");
      }
    } catch (error) {
      setSnackbarMessage("Failed to generate new API key");
    } finally {
      setIsLoading(false);
      setShowSnackbar(true);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          message={snackbarMessage}
        />
        <Typography variant="h1" gutterBottom>
          API Key Management
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Your current API key:
          </Typography>
          <TextField
            fullWidth
            value={apiKey}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyApiKey}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={
            <RefreshIcon className={isLoading ? "animate-spin" : ""} />
          }
          onClick={handleGenerateNewApiKey}
        >
          Generate New API Key
        </Button>
      </Paper>

      <Grid container spacing={3} mt={3}>
        <Grid item>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h2" gutterBottom>
              Help
            </Typography>
            <Typography variant="body2" gutterBottom>
              API keys are crucial for interacting with your channels. Ensure
              you keep them secure, as they grant access to your data streams.
              API keys are auto-generated when you create a new channel, but you
              can regenerate them as needed.
            </Typography>

            <Typography variant="body2" gutterBottom my={2}>
              You can generate two types of API keys:
              <ul>
                <li className="mt-1">
                  <strong>Write API Key:</strong> This key allows you to push
                  data to your channel. Keep it secure to prevent unauthorized
                  data uploads.
                </li>
                <li className="mt-1">
                  <strong>Read API Key:</strong> This key lets you or others
                  access data in your private channel. Share it only with
                  trusted parties.
                </li>
              </ul>
            </Typography>

            <Typography variant="h4" gutterBottom mt={2}>
              Best Practices
            </Typography>
            <Typography variant="body2" gutterBottom>
              <ul>
                <li>Rotate your API keys periodically to enhance security.</li>
                <li>
                  Restrict the use of API keys to specific IP addresses or
                  domains when possible.
                </li>
                <li>
                  Monitor the usage of your API keys to detect any unauthorized
                  access.
                </li>
                <li>
                  If an API key is compromised, regenerate it immediately and
                  update any systems using the old key.
                </li>
              </ul>
            </Typography>

            <Typography variant="h4" gutterBottom mt={2}>
              API Requests
            </Typography>

            <ListItem>
              <ListItemText
                primary="Write API Key"
                secondary="Use this key to write data to a channel."
              />
            </ListItem>

            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Write a Channel Feed
              </Typography>
              <code>
                POST {process.env.NEXT_PUBLIC_BASE_URL}
                /api/channels/datapoint?api_key={apiKey}
                &field1="value1"&field2="value2"...
              </code>
            </Box>

            <ListItem>
              <ListItemText
                primary="Read API Key"
                secondary="Use this key to allow others to view your private channel feeds and charts."
              />
            </ListItem>
            <Box sx={{ backgroundColor: "#f5f5f5", p: 2, mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Read a Channel Feed
              </Typography>
              <code>
                GET {process.env.NEXT_PUBLIC_BASE_URL}
                /api/channels/datapoint?api_key={apiKey}
              </code>
            </Box>

            <Box sx={{ backgroundColor: "#f5f5f5", p: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Read a Channel Field
              </Typography>
              <code>
                GET {process.env.NEXT_PUBLIC_BASE_URL}
                /api/channels/datapoint?api_key={apiKey}&field1=
              </code>
            </Box>

            <Typography variant="h4" gutterBottom mt={2}>
              Troubleshooting
            </Typography>
            <Typography variant="body2" gutterBottom>
              <ul>
                <li>
                  If you're unable to write data, ensure that the Write API Key
                  is correct and valid.
                </li>
                <li>
                  If data isn't being read correctly, check if the Read API Key
                  is valid and that the correct channel is being accessed.
                </li>
                <li>
                  For any issues, try regenerating the API key and updating your
                  requests accordingly.
                </li>
              </ul>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApiKeys;
