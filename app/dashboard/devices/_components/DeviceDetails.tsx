import React from "react";
import { StatusBadge } from "@/components";
import { Heading, Flex, Card, Text } from "@radix-ui/themes";

const DeviceDetails = () => {
  const device = {
    id: 1,
    title: "Rasperry Pi",
    description:
      "This device is used for the channel demonstration of sensor and devices' functionalities, data generation, and health purpose",
    channels: 3,
    status: "active",
    createdAt: "2023 - 02 - 10",
  };
  return (
    <div className="mt-5 mr-5">
      <Heading>{device.title}</Heading>
      <Flex gap="3" my="2">
        <StatusBadge status={device.status} />
        <Text>{device.createdAt}</Text>
      </Flex>
      <Card>{device.description}</Card>
    </div>
  );
};

export default DeviceDetails;
