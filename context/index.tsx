"use client";

import { ChannelProps } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

// Define the shape of your Organization state based on the Prisma schema
interface Organization {
  id: string;
  name: string;
  address?: string;
  type: OrganizationType;
  areaOfInterest: string[];
  userId: string;
}

enum OrganizationType {
  PERSONAL = "PERSONAL",
  ENTREPRISE = "ENTREPRISE",
}

interface currentUser {
  id: string;
  name: string;
  email: string;
  image: string | "";
  country: string;
  phonenumber: string;
  role: string;
  subscriptionId: string | null;
  organizationId: string | null;
}

// Define the global state interface
interface GlobalState {
  currentOrganization: Organization | null;
  userChannels: ChannelProps[] | [];
  currentUser: currentUser | null;
}

// Define the context type
interface GlobalStateContextType {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  fetchCurrentOrganization: () => Promise<void>;
  fetchUserChannels: () => Promise<void>;
  updateUserData: (newData: currentUser) => Promise<void>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    currentOrganization: null,
    userChannels: [],
    currentUser: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { status, data: sessionData } = useSession();

  // Effect to update global state when session changes
  useEffect(() => {
    if (status === "authenticated") {
      setState((prevState) => ({
        ...prevState,
        currentUser: {
          id: sessionData.user.id,
          name: sessionData.user.name,
          email: sessionData.user.email,
          image: sessionData.user.image || "",
          country: sessionData.user.country,
          phonenumber: sessionData.user.phonenumber,
          role: sessionData.user.role,
          subscriptionId: sessionData.user.subscriptionId,
          organizationId: sessionData.user.organizationId,
        },
      }));
    }
  }, [status, sessionData]);

  const fetchCurrentOrganization = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/organizations/status");

      if (response.status !== 200) {
        throw new Error("Failed to fetch organization");
      }

      const data = await response.data;
      setState((prevState) => ({
        ...prevState,
        currentOrganization: data.organization,
      }));
    } catch (error) {
      console.error("Error fetching organization:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserChannels = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/channels");
      if (res.status !== 200) {
        throw new Error("Failed to fetch channels");
      }
      const channelsData: ChannelProps[] = res.data;
      setState((prevState) => ({
        ...prevState,
        userChannels: channelsData,
      }));
    } catch (error) {
      console.error("Error fetching user channels:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserData = async (newData: currentUser) => {
    try {
      setIsLoading(true);
      // Update the user data on the server
      const res = await axios.put(`/api/users/${newData.id}`, newData);

      if (res.status !== 200) {
        throw new Error("Failed to update user data");
      }

      console.log("User data updated successfully", res.data);

      // Update the local state
      setState((prevState) => ({
        ...prevState,
        currentUser: newData,
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlobalStateContext.Provider
      value={{
        state,
        setState,
        fetchCurrentOrganization,
        fetchUserChannels,
        updateUserData,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
