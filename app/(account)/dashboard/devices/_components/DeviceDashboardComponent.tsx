import React, { useState, useEffect } from "react";
import { Widget, WidgetType } from "@/types/widgets";
import { Card } from "@mui/material";
import WidgetRegistry from "@/components/Channels/dashboard/widgets/WidgetComponents";
import EditDeviceWidgetGrid from "@/components/Channels/dashboard/widgets/EditDeviceWidgetGrid";
import WidgetGrid from "@/components/Channels/dashboard/widgets/WidgetGrid";

interface DeviceDashboardProps {
  widgetData: Widget[];
  deviceId: string;
}

const DeviceDashboardComponent: React.FC<DeviceDashboardProps> = ({
  widgetData,
  deviceId,
}) => {
  return <WidgetGrid deviceId={deviceId} widgets={widgetData} />;
};

export default DeviceDashboardComponent;
