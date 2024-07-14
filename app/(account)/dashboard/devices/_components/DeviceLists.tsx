"use client";

import StatusBadge from "@/components/StatusBadge";
import { Table } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import DeviceAction from "./DeviceAction";
import Link from "@/components/Link";

interface Device {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "2-digit",
  }).format(new Date(date));

const DeviceLists = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/devices");
        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        const data: Device[] = await response.json();
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  if (!devices) return null;

  return (
    <div className="w-full min-w-72 mt-5">
      <DeviceAction />
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Device</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Description
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {devices.map((device) => (
            <Table.Row key={device.id}>
              <Table.Cell className="min-w-32">
                <div className="flex justify-between">
                  <Link href={`/dashboard/devices/${device.id}`}>
                    {device.name}
                  </Link>
                  <div className="block md:hidden mb-2">
                    <StatusBadge status={device.status} />
                  </div>
                </div>
                <div className="block md:hidden">{device.description}</div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {device.description}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <StatusBadge status={device.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell min-w-32">
                {formatDate(device.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default DeviceLists;
