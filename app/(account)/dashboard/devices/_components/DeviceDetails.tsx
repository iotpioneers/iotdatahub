"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Box } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { ApiKey, Channel, Device } from "@/types";
import { LinearLoading } from "@/components/LinearLoading";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import Link from "next/link";
import DeviceDashboardComponent from "./DeviceDashboardComponent";
import { useIoTDataHub } from "@/hooks/useIoTDataHub";

interface Props {
  params: { id: string };
}

interface Organization {
  id: string;
  name: string;
  areaOfInterest: string[];
  Channel: Channel[];
  ApiKey: ApiKey[];
}

const DeviceDetails = ({ params }: Props) => {
  const [DeviceDetails, setShowModal] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>("1mo");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [device, setDevice] = useState<Device | null>(null);

  const { data: session, status } = useSession();

  const { data: RealTimeData, virtualWrite } = useIoTDataHub({
    deviceId: params.id,
  });

  console.log("RealTimeData:", RealTimeData);
  console.log("virtualWrite:", virtualWrite);

  if (status === "loading" || status === "unauthenticated" || !session) {
    return <LinearLoading />;
  }

  const {
    data: deviceData,
    isLoading,
    error,
  } = useFetch(`/api/devices/${params.id}`);

  const { data: organizationData } = useFetch(
    `/api/organizations/${session.user.organizationId}`,
  );

  const { data: widgetData } = useFetch(`/api/devices/${params.id}/widgets`);

  useEffect(() => {
    if (deviceData) setDevice(deviceData);
    if (organizationData) setOrganization(organizationData);
  }, [deviceData, organizationData]);

  if (error) {
    console.error("Error fetching device:", error);
    return (
      <Box className="text-red-500">
        {error || "There was an error while fetching the device"}
      </Box>
    );
  }

  const channel = organization?.Channel?.find(
    (channel: Channel) => channel.id === device?.channelId,
  );
  const apiKey = organization?.ApiKey?.find(
    (key: ApiKey) => key.channelId === channel?.id,
  );

  if (!device || !organization || !channel || !apiKey) {
    return <LinearLoading />;
  }

  return (
    <div className="min-h-screen px-4">
      {(isLoading || !deviceData || isRedirecting) && <LinearLoading />}
      {/* Main Dashboard Container */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
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
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-orange-50">
                  {deviceData.name}
                </h1>
                <span className="flex items-center">
                  {deviceData.status === "OFFLINE" ? (
                    <HiStatusOffline className="text-red-500 mr-2" />
                  ) : (
                    <HiStatusOnline className="text-green-500 mr-2" />
                  )}
                  <strong className="font-bold"> {deviceData.status}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>
                  Owner:{" "}
                  <strong className="font-bold"> {session?.user?.name}</strong>
                </span>
                <span>•</span>
                <span>
                  Organization:{" "}
                  <strong className="font-bold">
                    {organizationData.name || ""}
                  </strong>
                </span>
                <button
                  className="px-4 py-2 bg-orange-50 text-white rounded-lg hover:bg-green-600 font-medium"
                  onClick={() => setIsRedirecting(true)}
                >
                  <Link href={`/dashboard/devices/${params.id}/edit`}>
                    {isRedirecting || !deviceData ? <LinearLoading /> : "Edit"}
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>

        {!widgetData || widgetData.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-orange-50">
                No Dashboard widgets
              </h3>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-md">
            <DeviceDashboardComponent
              deviceId={params.id}
              widgetData={widgetData}
            />{" "}
          </div>
        )}
      </div>
      {/* Modal */}
      {DeviceDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6 font-mono text-sm">
              <div>
                <div className="text-gray-400">CHANNEL_ID</div>
                <div className="text-orange-50">"{channel?.id}"</div>
              </div>
              <div>
                <div className="text-gray-400">CHANNEL_NAME</div>
                <div className="text-orange-50">"{channel?.name}"</div>
              </div>
              <div>
                <div className="text-gray-400">CHANNEL_API_KEY</div>
                <div className="text-orange-50">"{apiKey?.apiKey}"</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceDetails;
