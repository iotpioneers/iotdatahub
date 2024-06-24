"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { AdjustmentsVerticalIcon } from "@heroicons/react/16/solid";
import { FaFileCsv, FaFileExcel } from "react-icons/fa6";
import Stream from "./navigation/Stream";
import CodeSnippet from "./navigation/CodeSnippet";
import { TextAlignRightIcon } from "@radix-ui/react-icons";
import { GiBracers } from "react-icons/gi";

interface Props {
  channelId: string;
}
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Navigation = ({ channelId }: Props) => {
  const handleDownload = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(downloadUrl);
  };

  //   const [open, setOpen] = useState(false);
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
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost">
                      Export
                      <DropdownMenu.TriggerIcon />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item
                      onSelect={() =>
                        handleDownload(
                          `/api/channels/${channelId}/export?format=csv`,
                          "data.csv"
                        )
                      }
                    >
                      <div className="flex items-center gap-5 cursor-pointer">
                        <FaFileCsv /> CSV
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() =>
                        handleDownload(
                          `/api/channels/${channelId}/export?format=xlsx`,
                          "data.xlsx"
                        )
                      }
                    >
                      <div className="flex items-center gap-5 cursor-pointer">
                        <FaFileExcel /> XLSX
                      </div>
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator />

                    <DropdownMenu.Item
                      onSelect={() =>
                        handleDownload(
                          `/api/channels/${channelId}/export?format=json`,
                          "data.json"
                        )
                      }
                    >
                      <div className="flex items-center gap-5 cursor-pointer">
                        <GiBracers /> JSON
                      </div>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() =>
                        handleDownload(
                          `/api/channels/${channelId}/export?format=txt`,
                          "data.txt"
                        )
                      }
                    >
                      <div className="flex items-center gap-5 cursor-pointer">
                        <TextAlignRightIcon /> TEXT
                      </div>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
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

export default Navigation;
