"use client";

import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Battery90 as BatteryIcon,
  SignalCellular4Bar as SignalIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

interface DeviceStatsProps {
  batteryLevel?: number;
  signal?: number;
  usage?: {
    value: number;
    unit: string;
    period: string;
  };
}

const DeviceStats: React.FC<DeviceStatsProps> = ({
  batteryLevel,
  signal,
  usage,
}) => {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
      {batteryLevel !== undefined && (
        <Tooltip title={`Battery Level: ${batteryLevel}%`}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              flex: 1,
              bgcolor: "background.default",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Stack spacing={1} alignItems="center">
              <BatteryIcon
                color={batteryLevel < 20 ? "error" : "success"}
                sx={{ fontSize: 28 }}
              />
              <Typography variant="body2" color="text.secondary">
                Battery
              </Typography>
              <LinearProgress
                variant="determinate"
                value={batteryLevel}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "action.hover",
                }}
              />
            </Stack>
          </Paper>
        </Tooltip>
      )}

      {signal !== undefined && (
        <Tooltip title={`Signal Strength: ${signal}%`}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              flex: 1,
              bgcolor: "background.default",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Stack spacing={1} alignItems="center">
              <SignalIcon
                color={signal < 30 ? "error" : "success"}
                sx={{ fontSize: 28 }}
              />
              <Typography variant="body2" color="text.secondary">
                Signal
              </Typography>
              <LinearProgress
                variant="determinate"
                value={signal}
                sx={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "action.hover",
                }}
              />
            </Stack>
          </Paper>
        </Tooltip>
      )}

      {usage && (
        <Tooltip
          title={`Usage: ${usage.value} ${usage.unit} per ${usage.period}`}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              flex: 1,
              bgcolor: "background.default",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <Stack spacing={1} alignItems="center">
              <SpeedIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="body2" color="text.secondary">
                Usage
              </Typography>
              <Box sx={{ width: "100%" }}>
                <Typography variant="body2" align="center">
                  {usage.value} {usage.unit}/{usage.period}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Tooltip>
      )}
    </Stack>
  );
};

export default DeviceStats;
