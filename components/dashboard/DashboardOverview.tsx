"use client";

import React from "react";
import {
  MdRouter,
  MdMusicNote,
  MdLightbulb,
  MdPrecisionManufacturing,
} from "react-icons/md";
import { redirect } from "next/navigation";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { Button, Heading, Switch, Text } from "@radix-ui/themes";
import { Avatar } from "@radix-ui/react-avatar";
import Link from "next/link";
import { DropdownMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { IconButton, TextField } from "@mui/material";

const dataLine = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 80 },
  { name: "Mar", value: 30 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 90 },
  { name: "Jul", value: 100 },
];

interface Organization {
  areaOfInterest: string;
  createdAt: Date;
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
  userId: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  avatar: string;
  access: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DashboardOverviewProps {
  organization: Organization | null;
  members: Member[] | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  organization,
  members,
}) => {
  const { status, data: session } = useSession();

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Welcome and Devices Section */}
        <div className="space-y-5">
          <div className="bg-orange-200 p-5 rounded-lg shadow-md mx-5 xs:mx-0">
            <div>
              <Heading as="h1" className="text-2xl font-bold mb-5">
                Hello, {session?.user?.name!}
              </Heading>
              <Text className="text-gray-600">
                Welcome to your personalized IoT dashboard. Here, you can manage
                your devices, monitor data, and stay connected.
              </Text>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <div className="flex justify-between items-center mb-5">
              <Heading as="h2" className="text-xl font-semibold">
                My Devices
              </Heading>
              <Button
                variant="outline"
                className="flex w-36 h-10 justify-center items-center bg-slate-200 rounded-md"
              >
                <Link
                  href="/dashboard/devices/new"
                  className="flex w-full h-full justify-center items-center gap-3"
                >
                  <PlusIcon className="w-4 h-4" /> Add Device
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Replace with actual device data */}
              <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdPrecisionManufacturing className="h-6 w-6" />
                  <Switch color="orange" className="h-6 w-6" />
                </div>
                <div>Tractor</div>
              </div>
              <div className="bg-yellow-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdRouter className="h-6 w-6" />
                  <Switch color="gray" highContrast className="h-6 w-6" />
                </div>
                <div>Router</div>
              </div>
              <div className="bg-red-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdMusicNote className="h-6 w-6" />
                  <Switch color="cyan" className="h-6 w-6" />
                </div>
                <div>Music System</div>
              </div>
              <div className="bg-teal-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32">
                <div className="flex space-x-3 justify-between">
                  <MdLightbulb className="h-6 w-6" />
                  <Switch color="crimson" className="h-6 w-6" />
                </div>
                <div>Lamps</div>
              </div>
            </div>
          </div>
        </div>

        {/* Members, and Power Consumption Section */}
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-5">
              <h1 className="flex items-center text-xl font-semibold gap-2">
                ORGANIZATION
                <div className="flex items-center">
                  <TextField value={organization?.name} className="mr-2" />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IconButton>
                        <DropdownMenuIcon className="w-6 h-6" />
                      </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Learn more</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </h1>
            </div>
            <h2 className="text-xl font-semibold mb-5">
              {members && members.length > 1
                ? `${members.length} Members`
                : "Member"}
            </h2>
            <div className="flex space-x-5 overflow-x-auto overflow-hidden">
              {/* Dynamically render members */}
              {members?.map((member) => (
                <div key={member.id} className="flex flex-col items-center">
                  <Avatar className="h-10 w-10 bg-purple-500 rounded-full text-white flex items-center justify-center">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </Avatar>
                  <div className="mt-2">{member.name}</div>
                  <div
                    className={`${
                      member.access === "VIEWER"
                        ? "bg-slate-900"
                        : member.access === "COMMENTER"
                        ? "bg-red-950"
                        : "bg-green-500"
                    } rounded-md px-2 py-1 text-white text-xs items-center`}
                  >
                    {member.access}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-5">Data Generated</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                width={730}
                height={250}
                data={dataLine}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
