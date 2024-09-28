"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import { styled } from "@mui/system";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import { styled } from "@mui/system";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { organizationSchema } from "@/validations/schema.validation";
import { useGlobalState } from "@/context";

// Define the enum AreaOfInterest
enum AreaOfInterest {
  TECHNOLOGY = "TECHNOLOGY",
  SCIENCE = "SCIENCE",
  HEALTH = "HEALTH",
  FINANCE = "FINANCE",
  EDUCATION = "EDUCATION",
  ART = "ART",
  ENVIRONMENT = "ENVIRONMENT",
  SPORTS = "SPORTS",
  POLITICS = "POLITICS",
  ENTERTAINMENT = "ENTERTAINMENT",
  BUSINESS = "BUSINESS",
  CULTURE = "CULTURE",
  TRAVEL = "TRAVEL",
  FOOD = "FOOD",
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const ImageButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "200px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: theme.palette.common.white,
  textShadow: "1px 1px 2px black",
  "&:hover": {
    opacity: 0.8,
  },
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Select organization type",
  "Choose preferences",
  "Create organization",
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
}));

const ImageButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "200px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: theme.palette.common.white,
  textShadow: "1px 1px 2px black",
  "&:hover": {
    opacity: 0.8,
  },
}));

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <CheckCircleIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "Select organization type",
  "Choose preferences",
  "Create organization",
];

const OrganizationOnboardingCreation: React.FC = () => {
  const { status } = useSession();
  const router = useRouter();
  const { setState } = useGlobalState();

  if (status !== "loading" && status === "unauthenticated") return null;

  const [error, setError] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [organizationType, setOrganizationType] = useState<
    "PERSONAL" | "ENTREPRISE" | ""
  >("");
  const [selectedAreasOfInterest, setSelectedAreasOfInterest] = useState<
    string[]
  >([]);
  const [customAreaOfInterest, setCustomAreaOfInterest] = useState<string>("");
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>(
    Object.values(AreaOfInterest)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const selectOrganizationType = (type: "PERSONAL" | "ENTREPRISE") => {
    if (!organizationName) {
      setError("Please enter an organization name");
      return;
    }
    setOrganizationType(type);
    setActiveStep(1);
    setActiveStep(1);
  };

  const handleOrganizationNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOrganizationName(event.target.value);
    setError("");
  };

  const handleAreaOfInterestChange = (interest: string) => {
  const handleAreaOfInterestChange = (interest: string) => {
    setSelectedAreasOfInterest((prevSelectedAreas) =>
      prevSelectedAreas.includes(interest)
        ? prevSelectedAreas.filter((area) => area !== interest)
        : [...prevSelectedAreas, interest]
      prevSelectedAreas.includes(interest)
        ? prevSelectedAreas.filter((area) => area !== interest)
        : [...prevSelectedAreas, interest]
    );
  };

  const handleCustomAreaOfInterestChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomAreaOfInterest(event.target.value.toUpperCase());
  };

  const addCustomAreaOfInterest = () => {
    if (
      customAreaOfInterest &&
      !areasOfInterest.includes(customAreaOfInterest)
    ) {
      setAreasOfInterest((prevAreas) => [...prevAreas, customAreaOfInterest]);
      setSelectedAreasOfInterest((prevSelectedAreas) => [
        ...prevSelectedAreas,
        customAreaOfInterest,
      ]);
      setCustomAreaOfInterest("");
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const organizationData = {
      name: organizationName,
      address: "N/A",
      type: organizationType,
      areaOfInterest: selectedAreasOfInterest,
    };

    const validation = organizationSchema.safeParse(organizationData);

    if (!validation.success) {
      setError(validation.error.errors.map((err) => err.message).join(", "));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/organizations",
        organizationData
      );

      if (response.status !== 201) {
        setError(response.statusText || "Error creating organization");
        setLoading(false);
        return;
      }

      const { newOrganization } = response.data;

      setState((prev) => ({
        ...prev,
        organization: newOrganization,
      }));
      setOpen(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/dashboard/channels");
      }, 100);
    } catch (error) {
      setError("Error creating organization");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
    <Container maxWidth="md">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="success"
          className="text-orange-50"
        >
          Your organization has been created successfully
        </Alert>
      </Snackbar>

      <StyledPaper elevation={3}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<ColorlibConnector />}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                className="text-orange-50"
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2, marginTop: 2 }}>
            {error}
          </Alert>
          <Alert severity="error" sx={{ marginBottom: 2, marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ mt: 4, color: "orange" }}

        {activeStep === 0 && (
          <Box>
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ mt: 4, color: "orange" }}
            >
              Organizing your work and collaborating with others is easier with
              an organization. Choose a name and type that best suits your
              needs.
            </Typography>
            <TextField
              fullWidth
              label="Organization Name"
              value={organizationName}
              onChange={handleOrganizationNameChange}
              margin="normal"
              required
            />
            <Typography
              variant="h1"
              align="center"
              gutterBottom
              className="text-orange-50"
            >
              Choose your organization type
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h2" className="text-orange-50">
                  Developer
                </Typography>
                <ImageButton
                  fullWidth
                  onClick={() => selectOrganizationType("PERSONAL")}
                  style={{
                    backgroundImage: "url('/makers.jpg')",
                  }}
                ></ImageButton>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h2" color={"orange"}>
                  Business
                </Typography>
                <ImageButton
                  fullWidth
                  onClick={() => selectOrganizationType("ENTREPRISE")}
                  style={{
                    backgroundImage: "url('/businesses.jpg')",
                  }}
                ></ImageButton>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ mt: 4 }}
              className="text-orange-50"
            >
              What are your preferences?
            </Typography>
            <Grid container spacing={2}>
              {areasOfInterest.map((interest) => (
                <Grid item xs={12} sm={6} md={4} key={interest}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAreasOfInterest.includes(interest)}
                        onChange={() => handleAreaOfInterestChange(interest)}
                      />
                    }
                    label={interest}
                  />
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Add your own area of interest"
                value={customAreaOfInterest}
                onChange={handleCustomAreaOfInterestChange}
              />
              <Button variant="contained" onClick={addCustomAreaOfInterest}>
                Add
              </Button>
            </Box>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={selectedAreasOfInterest.length === 0}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Create Your Organization
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Please review your information before creating your organization:
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {organizationName}
            </Typography>
            <Typography variant="body1">
              <strong>Type:</strong> {organizationType}
            </Typography>
            <Typography variant="body1">
              <strong>Areas of Interest:</strong>{" "}
              {selectedAreasOfInterest.join(", ")}
            </Typography>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="outlined" onClick={handleBack}>
                variant="contained"
                onClick={handleNext}
                disabled={selectedAreasOfInterest.length === 0}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Create Your Organization
            </Typography>
            <Typography variant="body1" align="center" paragraph>
              Please review your information before creating your organization:
            </Typography>
            <Typography variant="body1">
              <strong>Name:</strong> {organizationName}
            </Typography>
            <Typography variant="body1">
              <strong>Type:</strong> {organizationType}
            </Typography>
            <Typography variant="body1">
              <strong>Areas of Interest:</strong>{" "}
              {selectedAreasOfInterest.join(", ")}
            </Typography>
            <Box
              sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
            >
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Organization"}
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            </Box>
          </Box>
            </Box>
          </Box>
        )}
      </StyledPaper>
    </Container>
      </StyledPaper>
    </Container>
  );
};

export default OrganizationOnboardingCreation;
