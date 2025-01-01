"use client";

import React, { useState } from "react";
import styles from "@/styles/dashboard.module.css";

import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import DeviceDetails from "./DeviceDetails";

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  return (
    <div className="min-h-screen w-full">
      <div className="container p-4">
        <div className="flex">
          {/* Left Panel - Widget Box */}
          <div className={styles.widgetBox}>
            <h2 className="text-xl font-normal mb-6">Widget Box</h2>
            <WidgetBox />
          </div>

          {/* Right Panel - Dashboard Area */}

          <div className="flex-1 ml-6">
            <DeviceDetails params={params} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDashboardComponent;
