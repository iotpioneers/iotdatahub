"use client";

import React from "react";
import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
} from "@mui/material";
import { Alert as AlertType } from "@/types/device";

interface DeviceAlertsProps {
  alerts: AlertType[];
}

const severityColors = {
  INFO: "#2196f3",
  WARNING: "#ff9800",
  ERROR: "#f44336",
  CRITICAL: "#d32f2f",
};

const DeviceAlerts: React.FC<DeviceAlertsProps> = ({ alerts }) => {
  if (!alerts.length) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        bgcolor: "background.default",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, bgcolor: "background.paper" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Active Alerts
        </Typography>
      </Box>
      <List dense sx={{ p: 0 }}>
        {alerts.map((alert) => (
          <ListItem
            key={alert.id}
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={alert.severity}
                    size="small"
                    sx={{
                      bgcolor: severityColors[alert.severity],
                      color: "white",
                    }}
                  />
                  <Typography variant="body2">{alert.message}</Typography>
                </Box>
              }
              secondary={
                <Chip
                  label={alert.status}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DeviceAlerts;
