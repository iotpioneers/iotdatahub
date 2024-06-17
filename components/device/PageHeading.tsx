"use client";

import Loading from "@/app/loading";
import {
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import BackButton from "../BackButton";
import { Button, Card, Heading } from "@radix-ui/themes";
import { ChannelProps } from "@/types";

interface ChannelHeadingProps {
  channel: ChannelProps;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const PageHeading = ({ channel }: ChannelHeadingProps) => {
  if (!channel) {
    return <Loading />;
  }

  return (
    <div className="lg:flex lg:items-center lg:justify-between mt-12 padding-x padding-y max-width">
      <div className="min-w-0 flex-1">
        <Heading className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
          {channel?.name}
          {/* <span className="font-semibold">(#{channel?.deviceId})</span> */}
        </Heading>
        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <MapPinIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Kicukiro,Rwanda
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ChartPieIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Generated 120k
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Created on {formatDate(channel.createdAt)}
          </div>
        </div>
        <div className="mt-5 max-w-xl">
          <Card className="prose">
            <ReactMarkdown>{channel.description}</ReactMarkdown>
          </Card>
        </div>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <span className="hidden sm:block">
          <Button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <PencilIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Edit
          </Button>
        </span>

        <span className="ml-3 hidden sm:block">
          <Button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <LinkIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Link
          </Button>
        </span>

        <div className="sm:ml-3">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default PageHeading;
