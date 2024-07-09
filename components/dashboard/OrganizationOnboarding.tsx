"use client";

import { useState } from "react";
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
  orgName: string;
  orgAddress: string;
  areaOfInterest: AreaOfInterest | "";
  email: string;
  password: string;
}

const OrganizationOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
    // Handle form submission logic here
  };

  return (
    <div className="fixed top-12 left-1/2 transform -translate-x-1/2 w-full max-w-3xl min-h-96 justify-between bg-black rounded-lg p-5 z-50 mx-2 xs:mx-0">
      {step === 1 && (
        <div className="grid">
          <Heading
            as="h2"
            className="font-bold text-gray-10 text-center text-4xl mb-5"
          >
            Which feature do you need more?
          </Heading>
          <div className="flex w-full justify-between mb-5 gap-5 xs:gap-2">
            <div className="grid">
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
            <div className="grid">
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
          <div className="flex items-end">
            <Button
              className="bg-blue-500 text-white py-5 px-4 rounded my-5"
              onClick={nextStep}
            >
              Next
            </Button>
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
                  <input type="radio" name={interest} id={interest} />
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
              onClick={submitForm}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationOnboarding;
