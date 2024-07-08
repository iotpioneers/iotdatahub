"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Heading, Text } from "@radix-ui/themes";

// Define the enum AreaOfInterest
enum AreaOfInterest {
  TECHNOLOGY = "Technology",
  SCIENCE = "Science",
  HEALTH = "Health",
  FINANCE = "Finance",
  EDUCATION = "Education",
  ART = "Art",
  ENVIRONMENT = "Environment",
  SPORTS = "Sports",
  POLITICS = "Politics",
  ENTERTAINMENT = "Entertainment",
  BUSINESS = "Business",
  CULTURE = "Culture",
  TRAVEL = "Travel",
  FOOD = "Food",
}

interface FormData {
  termsAccepted: boolean;
  orgName: string;
  orgAddress: string;
  areaOfInterest: AreaOfInterest | "";
  email: string;
  password: string;
}

const OrganizationOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    termsAccepted: false,
    orgName: "",
    orgAddress: "",
    areaOfInterest: "",
    email: "",
    password: "",
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const submitForm = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="flex min-h-96 items-center justify-between bg-gray-30 rounded-sm p-5 z-10">
      {step === 1 && (
        <div className="mb-5">
          <Heading
            as="h2"
            className="font-bold text-gray-10 text-center text-4xl mb-5"
          >
            which feature do you need more?
          </Heading>
          <div className="flex w-full justify-between mb-5 gap-5">
            <div className="grid">
              <Text className="text-gray-10">
                For makers <br />
                <br />
              </Text>
              <img
                src="makers.jpg"
                alt="makers"
                className="w-56 h-56 rounded-md"
              />
            </div>
            <div className="grid">
              <Text className="text-gray-10">
                For businesses <br />
                <br />
              </Text>
              <img
                src="businesses.jpg"
                alt="businesses"
                className="w-56 h-56 rounded-md"
              />
            </div>
          </div>

          <Button
            className="bg-blue-500 text-white py-5 px-4 rounded my-5"
            onClick={nextStep}
          >
            Next
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="text-center">
          <Heading
            as="h2"
            className="font-bold text-black text-center text-4xl mb-5"
          >
            What are your preferences?
          </Heading>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 w-full p-2 mb-4 rounded">
            {Object.values(AreaOfInterest).map((interest) => (
              <li key={interest} value={interest}>
                <input type="radio" name={interest} id={interest} />
                {interest}
              </li>
            ))}
          </ul>
          <div className="flex justify-between">
            <Button
              className="bg-gray-500 text-white py-2 px-4 rounded"
              onClick={prevStep}
            >
              Back
            </Button>
            <Button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={submitForm}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationOnboarding;
