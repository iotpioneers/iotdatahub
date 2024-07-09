"use client";

import { CalendarIcon, LinkIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import BackButton from "../BackButton";
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { ChannelProps } from "@/types";
import EditChannel from "../Channels/EditChannel";
import ToastDemo from "../Toast/ToastDemo";
import LoadingSpinner from "../LoadingSpinner";

interface ChannelHeadingProps {
  channel: ChannelProps;
  dataReceived: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const PageHeading = ({ channel, dataReceived }: ChannelHeadingProps) => {
  if (!channel) {
    return <LoadingSpinner />;
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
            Generated {dataReceived} data
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
        <Box maxWidth="230px">
          <Flex gap="3" mb="5">
            <BackButton />
            <EditChannel />
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
          </Flex>
          <Card size="1">
            <a href="#">
              <Text as="div" color="gray" size="2">
                To send data to your channel, you have to use the API key
              </Text>
            </a>
          </Card>
          <ToastDemo title="Get started" />
        </Box>
      </div>
    </div>
  );
};

export default PageHeading;
