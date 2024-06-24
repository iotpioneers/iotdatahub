import prisma from "@/prisma/client";
import { Link, Table } from "@radix-ui/themes";
import { useEffect, useState } from "react";

interface Channel {
  id: string;
  name: string;
  description: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const ProjectList = async () => {
  const [channels, setChannels] = useState<Channel[] | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/channels");
        if (!res.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.json();

        // Assuming createdAt in channelsData is a string, parse it into Date
        channelsData.forEach((channel) => {
          channel.createdAt = new Date(channel.createdAt);
        });

        setChannels(channelsData);
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Handle error state or retry logic if needed
      }
    };

    fetchChannels();
  }, []);

  if (channels === null || channels.length === 0) {
    // Loading state or placeholder content while fetching channels
    return null;
  }

  return (
    <div>
      <Table.Root variant="surface" className="max-w-2xl">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Channel</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Description
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Latitude
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Longitude
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {channels.map((channel) => (
            <Table.Row key={channel.id}>
              {/* Add key prop */}
              <Table.Cell className="min-w-32">
                <div className="flex justify-between">
                  <Link href={`/dashboard/channels/${channel.id}`}>
                    {channel.name}
                  </Link>
                </div>
                <div className="block md:hidden mt-3">
                  {channel.description}
                </div>
                <div className="block md:hidden mt-3">
                  {formatDate(channel.createdAt)}
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {channel.description}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {channel.latitude || "N/A"}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {channel.longitude || "N/A"}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {formatDate(channel.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default ProjectList;
