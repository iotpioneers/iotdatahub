"use client";

import * as React from "react";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import TemplateFrame from "./TemplateFrame";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import { PaletteMode } from "@mui/material";
import getCheckoutTheme from "@/app/themes/getCheckoutTheme";
import Info from "./Info";
import InfoMobile from "./InfoMobile";

// Define types for the pricing tier
interface PricingTier {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: string;
  billingCycle: string;
  maxChannels: number;
  maxMessagesPerYear: number;
  features: string[];
  activation: boolean;
}

const steps = ["Client Details", "Payment Method"];

function getStepContent(step: number, subscriptionId: string) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm subscriptionId={subscriptionId} />;
    default:
      throw new Error("Unknown step");
  }
}

// Fetch function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Props {
  subscriptionId: string;
}

export default function Checkout({ subscriptionId }: Props) {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = React.useState(0);

  // Fetch pricing tier data using SWR
  const { data: pricingTier, error: pricingError } = useSWR<PricingTier>(
    `/api/pricing/${subscriptionId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(price);
  };

  // Get the current price based on the pricing tier data
  const getCurrentPrice = () => {
    if (pricingTier) {
      const basePrice = pricingTier.price;
      // Add any additional fees or taxes in step 2
      return activeStep >= 2 ? basePrice * 1.07 : basePrice; // Example: 7% tax in final step
    }
    return 0;
  };

  React.useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Show loading state while fetching data
  if (!pricingTier && !pricingError) {
    return <Typography>Loading pricing information...</Typography>;
  }

  // Show error state if fetch failed
  if (pricingError) {
    return (
      <Typography color="error">
        Error loading pricing information. Please try again later.
      </Typography>
    );
  }

  const formattedPrice = formatPrice(getCurrentPrice());

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
    >
      <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
        <CssBaseline enableColorScheme />

        <Grid
          container
          sx={{
            height: "100%",
            width: { xs: "100%", sm: "150%", md: "100%" },
            mt: { xs: -8, sm: -16 },
          }}
        >
          <Grid
            xs={8}
            sm={5}
            lg={4}
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              backgroundColor: "background.paper",
              borderRight: { sm: "none", md: "1px solid" },
              borderColor: { sm: "none", md: "divider" },
              alignItems: "start",
              pt: 16,
              px: 10,
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                maxWidth: 500,
              }}
            >
              <Info subscriptionId={subscriptionId} />
            </Box>
          </Grid>
          <Grid
            xs={12}
            sm={7}
            lg={8}
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "100%",
              width: "100%",
              backgroundColor: { xs: "transparent", sm: "background.default" },
              alignItems: "start",
              pt: { xs: 6, sm: 16 },
              px: { xs: 2, sm: 10 },
              gap: { xs: 4, md: 8 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: { sm: "space-between", md: "flex-end" },
                alignItems: "center",
                width: "100%",
                maxWidth: { sm: "100%", md: 600 },
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexGrow: 1,
                }}
              >
                <Stepper
                  id="desktop-stepper"
                  activeStep={activeStep}
                  sx={{ width: "100%", height: 40 }}
                >
                  {steps.map((label) => (
                    <Step
                      sx={{
                        ":first-child": { pl: 0 },
                        ":last-child": { pr: 0 },
                      }}
                      key={label}
                    >
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>
            <Card sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
              <CardContent
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="subtitle2" gutterBottom>
                    {pricingTier?.name || "Selected products"}
                  </Typography>
                  <Typography variant="body1">{formattedPrice}</Typography>
                </div>
                <InfoMobile subscriptionId={subscriptionId} />
              </CardContent>
            </Card>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "100%",
                maxWidth: { sm: "100%", md: 600 },
                maxHeight: "720px",
                gap: { xs: 5, md: "none" },
              }}
            >
              <Stepper
                id="mobile-stepper"
                activeStep={activeStep}
                alternativeLabel
                sx={{ display: { sm: "flex", md: "none" } }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{
                      ":first-child": { pl: 0 },
                      ":last-child": { pr: 0 },
                      "& .MuiStepConnector-root": { top: { xs: 6, sm: 12 } },
                    }}
                    key={label}
                  >
                    <StepLabel
                      sx={{
                        ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              <React.Fragment>
                {getStepContent(activeStep, subscriptionId)}
                <Box
                  sx={[
                    {
                      display: "flex",
                      flexDirection: { xs: "column-reverse", sm: "row" },
                      alignItems: "end",
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: "60px",
                    },
                    activeStep !== 0
                      ? { justifyContent: "space-between" }
                      : { justifyContent: "flex-end" },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{ display: { xs: "flex", sm: "none" } }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeStep < steps.length - 1 && (
                    <Button
                      variant="contained"
                      endIcon={<ChevronRightRoundedIcon />}
                      onClick={handleNext}
                      sx={{ width: { xs: "100%", sm: "fit-content" } }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </React.Fragment>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </TemplateFrame>
  );
}
