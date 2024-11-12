"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  organizationSchema,
  memberSchema,
} from "@/validations/schema.validation";

interface OrganizationRegistrationProps {
  userEmail: string;
}

const OrganizationRegistration: React.FC<OrganizationRegistrationProps> = ({
  userEmail,
}) => {
  const [registrationType, setRegistrationType] = useState<
    "single" | "enterprise"
  >("single");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [numberOfUsers, setNumberOfUsers] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const organizationData = {
        name: organizationName,
        address: organizationAddress,
        type: registrationType === "single" ? "PERSONAL" : "ENTREPRISE",
        areaOfInterest: [],
        userId: userEmail,
      };

      const validatedOrganization = await organizationSchema.parseAsync(
        organizationData
      );

      if (registrationType === "enterprise") {
        const memberData = {
          name: "Organization Owner",
          email: userEmail,
          phone: "",
          country: "",
          avatar: "",
          access: "EDITOR",
        };
        const validatedMember = await memberSchema.parseAsync(memberData);

        await axios.post("/api/organizations", {
          organization: validatedOrganization,
          member: validatedMember,
          numberOfUsers,
        });
      } else {
        await axios.post("/api/organizations", validatedOrganization);
      }

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || "An error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Register Your Organization</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              checked={registrationType === "single"}
              onChange={() => setRegistrationType("single")}
            />
            Single User Registration
          </label>
          <label>
            <input
              type="radio"
              checked={registrationType === "enterprise"}
              onChange={() => setRegistrationType("enterprise")}
            />
            Enterprise Registration
          </label>
        </div>
        <input
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Organization Name"
        />
        <input
          type="text"
          value={organizationAddress}
          onChange={(e) => setOrganizationAddress(e.target.value)}
          placeholder="Organization Address"
        />
        {registrationType === "enterprise" && (
          <input
            type="number"
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(parseInt(e.target.value))}
            placeholder="Number of Users"
          />
        )}
        <button type="submit">Register Organization</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default OrganizationRegistration;
