import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Channel {
  id: number;
  name: string;
  description: string;
  deviceId: string;
  lastSeen: Date | null;
  lastSeenDateTime: Date;
}

const ProjectList = async () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const isSmallScreens = useMediaQuery("(max-width: 760px)");

  useEffect(() => {
    const fetchChannels = async () => {
      const res = await fetch("http://localhost:3000/api/channels");
      const channelsData: Channel[] = await res.json();
      setChannels(channelsData);
    };

    fetchChannels();
  }, []);

  return (
    <ul role="list">
      {channels.map((project) => (
        <li
          key={project.description}
          className={`${
            isSmallScreens ? "block" : "flex"
          } justify-between gap-x-6 py-5 rounded-sm mt-2 padding-x border border-gray-200`}
        >
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="text-lg font-semibold leading-6 text-primary-blue">
                <Link href={`dashboard/channels?id=${project.id}`}>
                  {project.name}
                </Link>
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {project.description}
              </p>
            </div>
          </div>
          <div className="shrink-0 sm:flex sm:flex-col sm:items-end flex flex-auto">
            <p className="text-sm leading-6 text-gray-900">
              <span>Device ID: </span>{" "}
              <span className="font-semibold"># {project.deviceId}</span>
            </p>
            {project.lastSeen ? (
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Last seen{" "}
                <time dateTime={project.lastSeenDateTime?.toISOString() || ""}>
                  {project.lastSeen.toLocaleString()}
                </time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
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
