"use client";

import { Fragment } from "react";
import { Tab } from "@headlessui/react";
import { AdjustmentsVerticalIcon } from "@heroicons/react/16/solid";
import Stream from "./navigation/Stream";
import CodeSnippet from "./navigation/CodeSnippet";
import { Text } from "@radix-ui/themes";


interface Props {
  channelId:string;
}

const navigation = {
  categories: [
    {
      id: "stream",
      name: "Stream",
    },
    {
      id: "code",
      name: "Code",
    },
    {
      id: "settings",
      name: "Settings",
    },
    {
      id: "api_key",
      name: "API Keys",
    },
    {
      id: "export",
      name: "Export",
    },
  ],
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Navigation = ({ channelId }: Props) => {
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
              {navigation.categories.map((category) => (
                <Tab
                  key={category.name}
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "border-primary-blue text-primary-blue font-medium hover:text-gray-800"
                        : "border-transparent text-gray-700",
                      "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium text-gray-700 hover:text-gray-800"
                    )
                  }
                >
                  {category.name}
                </Tab>
              ))}
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
