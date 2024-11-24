import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Wifi, WifiOff, Timer, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionModalProps {
  open?: boolean;
  type?: "session" | "connection";
  onRefresh: () => void;
  onLogin: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  open = false,
  type = "session",
  onRefresh,
  onLogin,
}) => {
  const router = useRouter();
  const isSession = type === "session";

  // Loading states for both buttons
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshLoading(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshLoading(false);
    }
  };

  const handleLoginClick = async () => {
    setIsLoginLoading(true);
    try {
      router.push("/login");
    } finally {
      // In case of navigation failure
      setTimeout(() => setIsLoginLoading(false), 3000);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 3,
          }}
        >
          {/* Icon Container */}
          <Box
            sx={{
              backgroundColor: "primary.50",
              borderRadius: "50%",
              p: 2,
              mb: 3,
            }}
          >
            <IconButton
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                width: 56,
                height: 56,
              }}
            >
              {isSession ? <Timer size={32} /> : <WifiOff size={32} />}
            </IconButton>
          </Box>

          {/* Title */}
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {isSession
              ? "Whoops! Your session has expired"
              : "Sorry, there's no internet connection"}
          </Typography>

          {/* Message */}
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 300 }}>
            {isSession
              ? "Your session has expired. Please log in again to continue."
              : "Please check your connection and try again. If the problem persists, contact support."}
          </Typography>

          {/* Action Buttons */}
          {isSession ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleRefreshClick}
                disabled={isRefreshLoading || isLoginLoading}
                startIcon={!isRefreshLoading && <Timer size={20} />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  minWidth: 120,
                  position: "relative",
                }}
              >
                {isRefreshLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "primary.main",
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-12px",
                    }}
                  />
                ) : (
                  "Refresh"
                )}
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleLoginClick}
                disabled={isRefreshLoading || isLoginLoading}
                startIcon={!isLoginLoading && <LogIn size={20} />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 4,
                  minWidth: 120,
                  position: "relative",
                }}
              >
                {isLoginLoading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "common.white",
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-12px",
                    }}
                  />
                ) : (
                  "Login Again"
                )}
              </Button>
            </Stack>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleRefreshClick}
              disabled={isRefreshLoading}
              startIcon={!isRefreshLoading && <Wifi size={20} />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 4,
                minWidth: 120,
                position: "relative",
              }}
            >
              {isRefreshLoading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "common.white",
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-12px",
                  }}
                />
              ) : (
                "Retry"
              )}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SessionModal;
