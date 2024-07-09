"use client";

import React, { useState, useEffect } from "react";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { Heading, Card, Text } from "@radix-ui/themes";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import StatusBadge from "@/components/StatusBadge";
import LoadingSpinner from "@/components/LoadingSpinner";
interface Props {
  params: { id: string };
}

interface Device {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const DeviceDetails = async ({ params }: Props) => {
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

  if (loading || !device) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-5 mr-5">
      <Grid columns={{ initial: "1", sm: "5" }} gap="5">
        <Box className="md:col-span-4">
          <Heading>{device.name}</Heading>
          <Flex gap="3" my="2" justify="between">
            <Text>Date Created: {formatDate(device.createdAt)}</Text>
            <StatusBadge status={device.status} />
          </Flex>
          <Card>{device.description}</Card>
        </Box>
        <Box>
          <Flex direction="column" gap="4">
            <EditButton />
            <DeleteButton />
          </Flex>
        </Box>
      </Grid>
    </div>
  );
};

export default DeviceDetails;
