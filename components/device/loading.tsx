import { Button, Skeleton, Table } from "@radix-ui/themes";
import Link from "./Link";

const LoadingDevicesPage = () => {
  const devices = [1, 2, 3, 4, 5];

  return (
    <div className="mt-5 mr-5">
      <div className="mb-5">
        <Button>
          <Link href="/dashboard/devices/new">New device</Link>
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
              <Table.Cell key={device}>
                <Skeleton />
                <div className="block md:hidden">
                  <Skeleton />
                </div>
                <div className="block md:hidden min-w-96">
                  <Skeleton />
                  <Skeleton />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell min-w-96">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default LoadingDevicesPage;
