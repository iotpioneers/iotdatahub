import Pagination from "@/components/dashboard/Pagination";
import Link from "@/components/device/Link";
import StatusBadge from "@/components/StatusBadge";
import { Button, Table } from "@radix-ui/themes";
import { Description } from "@radix-ui/themes/dist/esm/components/alert-dialog.js";
import { channel } from "diagnostics_channel";
import { title } from "process";
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
      <div className="mb-5">
        <Button>
          <Link href="/#">New device</Link>
        </Button>
      </div>
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
              <Table.Cell key={device.id}>
                {device.title}
                <div className="block md:hidden">
                  <StatusBadge status={device.status} />
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
                {device.status}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
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
