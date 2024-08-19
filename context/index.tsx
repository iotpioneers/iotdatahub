"use client";

import { Channel } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
  image: string | null;
  country: string;
  phonenumber: string;
  role: string;
  subscriptionId: string | null;
  organizationId: string | null;
}

// Define the global state interface
interface GlobalState {
  currentOrganization: Organization | null;
  userChannels: Channel[] | [];
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
  const { status, data: session, update } = useSession();

  // Effect to update global state when session changes
  useEffect(() => {
    if (status === "authenticated") {
      setState((prevState) => ({
        ...prevState,
        currentUser: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image || null,
          country: session.user.country,
          phonenumber: session.user.phonenumber,
          role: session.user.role,
          subscriptionId: session.user.subscriptionId,
          organizationId: session.user.organizationId,
        },
      }));
    }
  }, [status, session, update]);

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
      const channelsData: Channel[] = res.data;
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

      console.log("newData", newData.image);

      // Update the user data on the server
      const res = await axios.put(`/api/users/${newData.id}`, newData);

      if (res.status !== 200) {
        throw new Error("Failed to update user data");
      }

      const updatedImage = newData.image
        ? `${newData.image}?t=${Date.now()}`
        : null;

      // Update the user data on the client
      await update({
        ...session,
        user: {
          ...session?.user,
          name: newData.name,
          image: updatedImage,
          phonenumber: newData.phonenumber,
          country: newData.country,
        },
      });

      console.log("User data updated on the client", session?.user);

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
