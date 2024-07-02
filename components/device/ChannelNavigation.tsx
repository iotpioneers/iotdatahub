"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { Text } from "@radix-ui/themes";
import { AdjustmentsVerticalIcon } from "@heroicons/react/16/solid";
import Stream from "./navigation/Stream";
import CodeSnippet from "./navigation/CodeSnippet";
import ExportChannelData from "../Channels/ExportChannelData";

interface Props {
  channelId: string;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const ChannelNavigation = ({ channelId }: Props) => {
  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <Text className="flex h-10 items-center justify-center bg-primary-blue px-4 text-sm font-medium text-white sm:px-6 lg:px-8 mr-5">
          Onboard your devices as quick as possible
        </Text>

        {/* Links */}
        <Tab.Group
          as="div"
          className="mt-2 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200 flex my-auto">
            <div className="px-1 py-3 h-full text-sm font-medium text-gray-700 hover:text-gray-800">
              <AdjustmentsVerticalIcon
                className="h-6 w-6 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <Tab.List className="h-full space-x-8 flex-1 text-center">
              <Tab
                key="Stream"
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                      : "border-transparent text-gray-700",
                    "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                  )
                }
              >
                Stream
              </Tab>
              <Tab
                key="Code"
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                      : "border-transparent text-gray-700",
                    "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                  )
                }
              >
                Code
              </Tab>
              <Tab
                key="Settings"
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                      : "border-transparent text-gray-700",
                    "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                  )
                }
              >
                Settings
              </Tab>
              <Tab
                key="API_Keys"
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                      : "border-transparent text-gray-700",
                    "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                  )
                }
              >
                API Keys
              </Tab>
              <Tab
                key="Export"
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                      : "border-transparent text-gray-700",
                    "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                  )
                }
              >
                <ExportChannelData channelId={channelId} />
              </Tab>
            </Tab.List>
          </div>
          <Tab.Panels as={Fragment}>
            <Tab.Panel className="space-y-10 px-4 pb-8 pt-10">
              <Stream channelId={channelId} />
            </Tab.Panel>
            <Tab.Panel className="space-y-10 px-4 pb-8 pt-10">
              <CodeSnippet />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </header>
    </div>
  );
};

export default ChannelNavigation;
