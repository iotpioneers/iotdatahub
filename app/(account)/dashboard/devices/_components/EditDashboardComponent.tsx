"use client";

import React from "react";
import styles from "@/styles/dashboard.module.css";
import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import DeviceDetails from "./DeviceDetails";
import EditDeviceDashboard from "./EditDeviceDashboard";
import { Button } from "@mui/material";

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-8 h-8 text-orange-50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-orange-50">
                IoT DATA HUB
              </h1>
            </div>
          </div>
        </div>
        <div className="flex">
          <Button>Cancel</Button>
          <Button>Save And Apply Changes</Button>
        </div>
      </div>

      <div className="container p-4">
        <h1 className="text-orange-50 text-lg">Web Dashboard</h1>
        <div className="flex">
          <div className={styles.widgetBox}>
            <h2 className="text-xl font-normal mb-6">Widget Box</h2>
            <WidgetBox deviceId={params.id} />
          </div>

          <div className="flex-1 ml-6">
            <EditDeviceDashboard params={params} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDashboardComponent;
