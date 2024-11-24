"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { Heading, Card, Text } from "@radix-ui/themes";
import StatusBadge from "@/components/StatusBadge";
import DeviceControl from "./DeviceControl";
import { Skeleton } from "@mui/material";

interface Props {
  params: { id: string };
}

interface Device {
  id: string;
  name: string;
  description: string;
  status: "ONLINE" | "OFFLINE" | "DISCONNECTED";
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const DeviceDetails = ({ params }: Props) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/devices/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch device data");
        }
        const deviceData: Device = await response.json();
        setDevice(deviceData);
      } catch (error) {
        setError("Failed to fetch device data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDevice();
    }
  }, [params.id]);

  const handleStatusChange = (
    newStatus: "ONLINE" | "OFFLINE" | "DISCONNECTED"
  ) => {
    if (device) {
      setDevice({ ...device, status: newStatus });
    }
  };

  if (loading) {
    return (
      <Box className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-12 w-[150px]" />
      </Box>
    );
  }

  if (error || !device) {
    return <Box className="text-red-500">{error || "Device not found"}</Box>;
  }

  return (
    <Box className="space-y-6">
      <Card>
        <Flex direction="column" gap="4" p="4">
          <Flex justify="between" align="center">
            <Heading size="4">{device.name}</Heading>
            <StatusBadge status={device.status} />
          </Flex>

          <Text color="gray" size="2">
            Date Created: {formatDate(device.createdAt)}
          </Text>

          <Text>{device.description}</Text>

          <DeviceControl
            deviceId={device.id}
            initialStatus={device.status}
            onStatusChange={handleStatusChange}
          />
        </Flex>
      </Card>
    </Box>
  );
};

export default DeviceDetails;
