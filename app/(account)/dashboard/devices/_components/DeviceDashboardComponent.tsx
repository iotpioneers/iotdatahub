import React from "react";
import { Widget } from "@/types/widgets";
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
