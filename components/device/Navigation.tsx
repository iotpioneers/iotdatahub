"use client";

import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  WifiIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AdjustmentsVerticalIcon } from "@heroicons/react/16/solid";
import BarChartComponent from "./charts/BarChartComponent";
import LineChartComponent from "./charts/LineChartComponent";
import Stream from "./navigation/Stream";
import CodeSnippet from "./navigation/CodeSnippet";

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

const Navigation = () => {
  //   const [open, setOpen] = useState(false);
  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-primary-blue px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Onboard your devices as quick as possible
        </p>

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
              {/* Promise for mobile experience */}
              {/* <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button> */}
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
              <Stream />
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
