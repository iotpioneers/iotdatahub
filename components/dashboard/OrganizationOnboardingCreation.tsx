"use client";

import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Button, Callout, Heading, Text } from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { organizationSchema } from "@/validations/schema.validation";
import { useGlobalState } from "@/context";
import axios from "axios";
import { useSession } from "next-auth/react";
import { createOrganizationRoom } from "@/lib/actions/room.actions";

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

const OrganizationOnboardingCreation: React.FC = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { setState } = useGlobalState();

  if (status !== "loading" && status === "unauthenticated")
    router.push("/login");

  const { id: userId, email } = session!.user;

  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<number>(1);
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

  // Generate organization name
  const organizationName = "MY-ORG-" + nanoid(6);

  // Function to handle organization type selection
  const selectOrganizationType = (type: "PERSONAL" | "ENTREPRISE") => {
    setOrganizationType(type);
    setStep(2);
  };

  // Function to handle area of interest selection
  const handleAreaOfInterestChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSelectedAreasOfInterest((prevSelectedAreas) =>
      prevSelectedAreas.includes(value)
        ? prevSelectedAreas.filter((area) => area !== value)
        : [...prevSelectedAreas, value]
    );
  };

  // Function to handle custom area of interest input change
  const handleCustomAreaOfInterestChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomAreaOfInterest(event.target.value.toUpperCase());
  };

  // Function to add custom area of interest
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

  // Function to go back to previous step
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Function to submit organization data
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
      const response = await axios.post("/api/organizations", organizationData);

      if (response.status !== 201) {
        setError(response.statusText || "Error creating organization");
        setLoading(false);
        return;
      }

      const { newOrganization } = response.data;

      const { id: roomId, name: title } = newOrganization;

      await createOrganizationRoom({
        roomId,
        userId,
        email,
        title,
      });

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-5 -mt-2 ">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Your preferences has been saved successfully
        </Alert>
      </Snackbar>
      <div className="bg-n-9 rounded-lg p-5 max-w-3xl w-full min-h-96 mx-5">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        {step === 1 && (
          <div className="grid">
            <Heading
              as="h2"
              className="font-bold text-gray-10 text-center text-md mb-5"
            >
              Which feature do you need more?
            </Heading>
            <div className="flex w-full justify-between mb-5 gap-5 xs:gap-2">
              <div
                className="grid cursor-pointer"
                onClick={() => selectOrganizationType("PERSONAL")}
              >
                <Text className="text-gray-10 font-semibold">
                  For makers <br />
                  <br />
                </Text>
                <img
                  src="makers.jpg"
                  alt="makers"
                  className="w-56 h-56 md:min-w-80 rounded-md"
                />
              </div>
              <div
                className="grid cursor-pointer"
                onClick={() => selectOrganizationType("ENTREPRISE")}
              >
                <Text className="text-gray-10 font-semibold">
                  For businesses <br />
                  <br />
                </Text>
                <img
                  src="businesses.jpg"
                  alt="businesses"
                  className="w-56 h-56 md:min-w-80 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="grid">
            <div>
              <Heading
                as="h2"
                className="font-bold text-gray-10 text-center text-4xl mb-5 lg:mb-10"
              >
                What are your preferences?
              </Heading>
              <ul className="grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full p-2 mb-4 rounded gap-5">
                {areasOfInterest.map((interest) => (
                  <li
                    key={interest}
                    value={interest}
                    className="flex items-center text-gray-10 font-semibold text-lg gap-2"
                  >
                    <input
                      type="checkbox"
                      id={interest}
                      value={interest}
                      checked={selectedAreasOfInterest.includes(interest)}
                      onChange={handleAreaOfInterestChange}
                    />
                    {interest}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center gap-2 mb-4">
                <input
                  type="text"
                  value={customAreaOfInterest}
                  onChange={handleCustomAreaOfInterestChange}
                  placeholder="Add your own area of interest"
                  className="px-3 py-2 border rounded"
                />
                <Button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                  onClick={addCustomAreaOfInterest}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <Button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={handleSubmit}
                disabled={loading}
                style={{ zIndex: 10 }}
              >
                {loading ? "Submitting..." : "Done"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationOnboardingCreation;
