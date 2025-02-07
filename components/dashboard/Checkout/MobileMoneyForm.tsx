"use client";

import React from "react";
import useSWR from "swr";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import { PhoneAndroidRounded } from "@mui/icons-material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Image from "next/image";

interface Props {
  subscriptionId: string;
}

interface MoMoData {
  message: string;
  error?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

type Provider = "mtn" | "airtel";

const fetcher = async (
  url: string,
  {
    arg,
  }: { arg: { pricingId: string; phoneNumber: string; provider: Provider } }
) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to process payment");
  }

  return response.json();
};

const MobileMoneyForm = ({ subscriptionId }: Props) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [provider, setProvider] = React.useState<Provider>("mtn");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const {
    data,
    error: swrError,
    mutate,
  } = useSWR<MoMoData, Error>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing/payment/momo`,
    null,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const handleProviderChange = (
    event: React.MouseEvent<HTMLElement>,
    newProvider: Provider | null
  ) => {
    if (newProvider !== null) {
      setProvider(newProvider);
      setPhoneNumber("");
      setFormError("");
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showNotification = (
    message: string,
    severity: SnackbarState["severity"]
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const isValidPhoneNumber = (number: string, provider: Provider) => {
    if (!number || number.length !== 10) return false;

    const mtnPrefixes = ["078", "079"];
    const airtelPrefixes = ["073", "072"];
    const prefix = number.substring(0, 3);

    if (provider === "mtn") {
      return mtnPrefixes.includes(prefix);
    } else {
      return airtelPrefixes.includes(prefix);
    }
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setFormError("");
    }
  };

  const handleSubmit = async () => {
    if (!isValidPhoneNumber(phoneNumber, provider)) {
      const errorMessage = `Please enter a valid ${provider.toUpperCase()} number (${
        provider === "mtn" ? "078/079" : "072/073"
      })`;
      setFormError(errorMessage);
      showNotification(errorMessage, "error");
      return;
    }

    setIsProcessing(true);
    showNotification("Processing your payment...", "info");

    try {
      const result = await mutate(
        fetcher(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing/payment/momo`,
          {
            arg: {
              pricingId: subscriptionId,
              phoneNumber: phoneNumber,
              provider: provider,
            },
          }
        ),
        {
          revalidate: false,
        }
      );

      if (result?.error) {
        throw new Error(result.error);
      }

      showNotification("Payment processed successfully!", "success");
      setPhoneNumber("");
      setFormError("");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Payment processing failed. Please try again.";
      setFormError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    if (swrError) {
      setFormError(swrError.message);
      showNotification(swrError.message, "error");
    }
  }, [swrError]);

  React.useEffect(() => {
    if (data?.message) {
      showNotification(data.message, "success");
    }
  }, [data]);

  return (
    <Card sx={{ width: "100%", maxWidth: "none" }}>
      <CardContent sx={{ p: 4 }}>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5">Mobile Money Payment</Typography>
          <PhoneAndroidRounded sx={{ color: "text.secondary", fontSize: 32 }} />
        </Box>

        <FormControl fullWidth>
          <FormLabel sx={{ mb: 2 }}>
            Please select your mobile money provider
          </FormLabel>
          <ToggleButtonGroup
            value={provider}
            exclusive
            onChange={handleProviderChange}
            aria-label="mobile money provider"
            sx={{
              width: "100%",
              mb: 4,
              "& .MuiToggleButton-root": {
                flex: 1,
                height: "120px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: "1px solid",
                borderColor: "divider",
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                },
              },
            }}
          >
            <ToggleButton value="mtn" aria-label="MTN Mobile Money">
              <Box sx={{ position: "relative", width: 120, height: 60 }}>
                <Image
                  src="/momo/mtn.jpg"
                  alt="MTN MoMo"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Box>
              <Typography>MTN MoMo</Typography>
            </ToggleButton>
            <ToggleButton value="airtel" aria-label="Airtel Money">
              <Box sx={{ position: "relative", width: 120, height: 60 }}>
                <Image
                  src="/momo/airtel.jpg"
                  alt="Airtel Money"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Box>
              <Typography>Airtel Money</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <FormLabel htmlFor="phone-number" required>
            Enter your{" "}
            {provider === "mtn"
              ? "MTN Mobile Money Number"
              : "Airtel Money Number"}{" "}
            to pay
          </FormLabel>
          <OutlinedInput
            id="phone-number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={
              provider === "mtn" ? "Ex: 078/079XXXXXXX" : "Ex: 072/073XXXXXXX"
            }
            startAdornment={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <img
                  loading="lazy"
                  width="20"
                  srcSet="https://flagcdn.com/w40/rw.png 2x"
                  src="https://flagcdn.com/w20/rw.png"
                  alt="Rwanda"
                  style={{ marginRight: "4px" }}
                />
              </Box>
            }
            error={!!formError}
            disabled={isProcessing}
            fullWidth
            sx={{ mt: 1 }}
          />
          {formError && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {formError}
            </Typography>
          )}
        </FormControl>

        {isValidPhoneNumber(phoneNumber, provider) && (
          <Typography variant="body2" mt={2}>
            After you press Pay Now, you will be prompted to submit your Mobile
            Money PIN on your phone to complete the payment
          </Typography>
        )}

        {isValidPhoneNumber(phoneNumber, provider) && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isProcessing}
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileMoneyForm;
