import StatusBadge from "@/components/StatusBadge";
import { Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = ({ params }: Props) => {
  const device = {
    id: 1,
    title: "Rasperry Pi",
    description:
      "This device is used for the channel demonstration of sensor and devices' functionalities, data generation, and health purpose",
    channels: 3,
    status: "active",
    createdAt: "2023 - 02 - 10",
  };

  if (!params.id) notFound();

  return (
    <div className="mt-5">
      <Heading>{device.title}</Heading>
      <Flex gap="3" my="2">
        <StatusBadge status={device.status} />
        <Text>{device.createdAt}</Text>
      </Flex>
    </div>
  );
};

export default DeviceDetailsPage;
