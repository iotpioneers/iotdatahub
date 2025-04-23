"use client";

import React from "react";
import { LinearProgress } from "@mui/material";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = "Loading...",
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
        <LinearProgress color="primary" />
        <p className="mt-2 text-center">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
