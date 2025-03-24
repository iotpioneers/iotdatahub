import React, { useState, useEffect } from "react";
import { Widget, WidgetType } from "@/types/widgets";
import { Card } from "@mui/material";
import WidgetRegistry from "@/components/Channels/dashboard/widgets/WidgetComponents";
import EditDeviceWidgetGrid from "@/components/Channels/dashboard/widgets/EditDeviceWidgetGrid";
import WidgetGrid from "@/components/Channels/dashboard/widgets/WidgetGrid";

interface DeviceDashboardProps {
  widgetData: Widget[];
}

const DeviceDashboardComponent: React.FC<DeviceDashboardProps> = ({
  widgetData,
}) => {
  return <WidgetGrid widgets={widgetData} />;
};

export default DeviceDashboardComponent;
