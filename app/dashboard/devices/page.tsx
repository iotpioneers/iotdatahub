import Pagination from "@/components/dashboard/Pagination";
import DeviceAction from "@/components/device/DeviceAction";
import Link from "@/components/device/Link";
import StatusBadge from "@/components/StatusBadge";
import { Table } from "@radix-ui/themes";
import React from "react";

const page = () => {
  const devices = [
    {
      id: 1,
      title: "Rasperry Pi",
      description:
        "This device is used for the channel demonstration of sensor and devices' functionalities, data generation, and health purpose",
      channels: 3,
      status: "active",
      createdAt: "2023 - 02 - 10",
    },
    {
      id: 2,
      title: "Arduio Uno",
      description:
        "This device is used for the channel demonstration of sensor and devices' functionalities, data generation, and health purpose",
      channels: 1,
      status: "disabled",
      createdAt: "2023 - 02 - 10",
    },
    {
      id: 3,
      title: "Arduio Nano",
      description:
        "This device is used for the channel demonstration of sensor and devices' functionalities, data generation, and health purpose",
      channels: 1,
      status: "disconnected",
      createdAt: "2023 - 02 - 10",
    },
  ];

  return (
    <div className="mt-5">
      <DeviceAction />
      <Table.Root variant="surface" className="mr-5">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Device</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Description
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Channels
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
            <Table.Row>
              <Table.Cell key={device.id} className="min-w-32">
                <div className="flex justify-between">
                  <Link href={`/dashboard/devices/${device.id}`}>
                    {device.title}
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
                {device.channels}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <StatusBadge status={device.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell min-w-32">
                {device.createdAt}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div>
        <Pagination />
      </div>
    </div>
  );
};
export default page;
