"use client";

import { useState } from "react";
import { Button, Callout, Heading, Text } from "@radix-ui/themes";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { organizationSchema } from "@/validations/schema.validation";

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
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [organizationType, setOrganizationType] = useState<
    "PERSONAL" | "ENTREPRISE" | ""
  >("");
  const [selectedAreaOfInterest, setSelectedAreaOfInterest] =
    useState<string>("");

  const router = useRouter();

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
    setSelectedAreaOfInterest(event.target.value);
  };

  // Function to go back to previous step
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Function to submit organization data
  const handleSubmit = async () => {
    const organizationData = {
      name: organizationName,
      address: "N/A",
      type: organizationType,
      areaOfInterest: selectedAreaOfInterest,
    };

    const validation = organizationSchema.safeParse(organizationData);

    if (!validation.success) {
      setError(validation.error.errors.map((err) => err.message).join(", "));
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Error creating organization");
        return;
      }

      const newOrganization = await response.json();
      console.log("New organization created:", newOrganization);

      // Navigate to the dashboard or any other page after successful creation
      router.push("/dashboard");
    } catch (error) {
      setError("Error creating organization");
    }
  };

  return (
    <div className="fixed top-14 left-1/2 transform -translate-x-1/2 w-full max-w-3xl min-h-96 justify-between bg-n-9 rounded-lg p-5 z-50 mx-0">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      {step === 1 && (
        <div className="grid">
          <Heading
            as="h2"
            className="font-bold text-gray-10 text-center text-4xl mb-5"
          >
            Which feature do you need more?
          </Heading>
          <div className="flex w-full justify-between mb-5 gap-5 xs:gap-2">
            <div
              className="grid"
              onClick={() => selectOrganizationType("PERSONAL")}
            >
              <Text className="text-gray-10 font-semibold">
                For makers <br />
                <br />
              </Text>
              <img
                src="makers.jpg"
                alt="makers"
                className="w-56 h-56 md:min-w-80 rounded-md cursor-pointer"
              />
            </div>
            <div
              className="grid"
              onClick={() => selectOrganizationType("ENTREPRISE")}
            >
              <Text className="text-gray-10 font-semibold">
                For businesses <br />
                <br />
              </Text>
              <img
                src="businesses.jpg"
                alt="businesses"
                className="w-56 h-56 md:min-w-80 rounded-md cursor-pointer"
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
              {Object.values(AreaOfInterest).map((interest) => (
                <li
                  key={interest}
                  value={interest}
                  className="flex items-center text-gray-10 font-semibold text-lg gap-2"
                >
                  <input
                    type="radio"
                    id={interest}
                    value={interest}
                    name="areaOfInterest"
                    onChange={handleAreaOfInterestChange}
                  />
                  {interest}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-end justify-between">
            <Button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={prevStep}
            >
              Back
            </Button>
            <Button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={handleSubmit}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationOnboardingCreation;
