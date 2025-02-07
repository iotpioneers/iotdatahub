"use client";

import React, { useState } from "react";
import styles from "@/styles/dashboard.module.css";
import WidgetBox from "@/components/Channels/dashboard/WidgetBox";
import DeviceDetails from "./DeviceDetails";
import { Widget } from "@/types/widgets";

interface Props {
  params: { id: string };
}

const EditDashboardComponent = ({ params }: Props) => {
  return (
    <div className="min-h-screen w-full">
      <div className="container p-4">
        <div className="flex">
          <div className={styles.widgetBox}>
            <h2 className="text-xl font-normal mb-6">Widget Box</h2>
            <WidgetBox deviceId={params.id} />
          </div>

          <div className="flex-1 ml-6">
            <DeviceDetails params={params} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDashboardComponent;
