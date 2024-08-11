"use client";

import { ChannelProps } from "@/types";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
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

// Define the global state interface
interface GlobalState {
  currentOrganization: Organization | null;
  userChannels: ChannelProps[] | []; // Corrected spelling here
}

// Define the context type
interface GlobalStateContextType {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  fetchCurrentOrganization: () => Promise<void>;
  fetchUserChannels: () => Promise<void>;
  isLoading: boolean;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GlobalState>({
    currentOrganization: null,
    userChannels: [], // Corrected spelling here
  });

  const [isLoading, setIsLoading] = useState(false);

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
        userChannels: channelsData, // Corrected spelling here
      }));
    } catch (error) {
      console.error("Error fetching user channels:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        state,
        setState,
        fetchCurrentOrganization,
        fetchUserChannels,
        isLoading,
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
