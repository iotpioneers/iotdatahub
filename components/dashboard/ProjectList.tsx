import useMediaQuery from "@/hooks/useMediaQuery";
import { Card, Heading, Spinner, Text } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { LoadingPage } from "../device";

interface Channel {
  id: number;
  name: string;
  description: string;
  deviceId: string;
  lastSeen: Date | null;
  lastSeenDateTime: Date;
}

const ProjectList = async () => {
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const isSmallScreens = useMediaQuery("(max-width: 760px)");

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/channels");
        if (!res.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.json();
        setChannels(channelsData);
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Handle error state or retry logic if needed
      }
    };

    fetchChannels();
  }, []);

  if (channels === null) {
    // Loading state or placeholder content while fetching channels
    return <LoadingPage />;
  }

  if (channels.length === 0) {
    // No channels found for the user
    return <Heading>No channels found.</Heading>;
  }

  return (
    <ul role="list">
      {channels &&
        channels.map((project) => (
          <li
            key={project.description}
            className={`${
              isSmallScreens ? "block" : "flex"
            } justify-between gap-x-6 py-5 rounded-sm mt-2 padding-x border border-gray-200`}
          >
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <Text className="text-lg font-semibold leading-6 text-primary-blue">
                  <Link href={`/dashboard/channels/${project.id}`}>
                    {project.name}
                  </Link>
                </Text>
                <Card className="prose mt-2 mb-2 truncate text-xs leading-5 text-gray-500">
                  <ReactMarkdown className=" md:min-w-96">
                    {project.description}
                  </ReactMarkdown>
                </Card>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end flex flex-auto">
              {project.lastSeen ? (
                <Text className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen{" "}
                  <time
                    dateTime={project.lastSeenDateTime?.toISOString() || ""}
                  >
                    {project.lastSeen.toLocaleString()}
                  </time>
                </Text>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5 ml-2">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ProjectList;
