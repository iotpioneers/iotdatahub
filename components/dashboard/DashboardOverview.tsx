"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrendingUp } from "react-icons/fi";

// project imports
import OrganizarionOverviewCard from "@/components/dashboard/Overview/OrganizarionOverviewCard";
import TotalDataGeneratedCard from "@/components/dashboard/Overview/TotalDataGeneratedCard";
import ChannelActivityOverview from "@/components/dashboard/Overview/DeviceActivityOverview";
import TotalChannelCard from "@/components/dashboard/Overview/TotalChannelCard";
import TotalDevicesCard from "@/components/dashboard/Overview/TotalDevicesCard";
import WelcomeContentCard from "./Overview/WelcomeContentCard";

// types
import { Channel, DataPoint, Field, Device, Organization } from "@/types";
import { EmployeeMember } from "@/types/employees-member";

interface DashboardOverviewProps {
  organization: Organization | null;
  members: EmployeeMember[] | null;
  devices: Device[] | null;
  channels: Channel[] | null;
  fields: Field[] | null;
  datapoints: DataPoint[] | null;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  organization,
  members,
  devices,
  channels,
  fields,
  datapoints,
}) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRedirect = (href: string) => {
    setIsRedirecting(true);
    setLoading(true);
    router.push(href);
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-12 gap-4 mb-4 h-full">
        {/* First Row */}
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-4">
            {/* Welcome Card (8 columns) */}
            <div className="col-span-12 md:col-span-8 lg:col-span-8">
              <WelcomeContentCard />
            </div>

            {/* Organization and Data Cards (4 columns) */}
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <div className="grid gap-4">
                {/* Organization Card */}
                <div
                  className="col-span-1 cursor-pointer"
                  onClick={() => handleRedirect("/organization/dashboard")}
                >
                  <OrganizarionOverviewCard
                    isLoading={isLoading || isRedirecting}
                    organization={organization}
                    members={members}
                  />
                </div>

                {/* Data Generated Card */}
                <div className="col-span-1">
                  <TotalDataGeneratedCard
                    isLoading={isLoading}
                    total={datapoints ? datapoints.length : 0}
                    label="Total Datapoint Uploads"
                    icon={<FiTrendingUp className="text-xl" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Channels Card */}
            <div
              className="cursor-pointer"
              onClick={() => handleRedirect("/dashboard/channels")}
            >
              <TotalChannelCard isLoading={isLoading} channels={channels} />
            </div>

            {/* Devices Card */}
            <div
              className="cursor-pointer"
              onClick={() => handleRedirect("/organization/dashboard")}
            >
              <TotalDevicesCard isLoading={isLoading} devices={devices} />
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-4">
            {/* Channel Activity Overview */}
            <div className="col-span-12 md:col-span-8 rounded-md border shadow shadow-black bg-white">
              <ChannelActivityOverview
                isLoading={isLoading}
                channels={channels}
                fields={fields}
                dataPoints={datapoints}
              />
            </div>

            {/* User Activity Overview */}
            {/* <div className="col-span-12 md:col-span-4 rounded-md border shadow shadow-black bg-white">
              <UserActivityOverviewCard
                isLoading={isLoading}
                devices={devices}
                channels={channels}
                fields={fields}
                dataPoints={datapoints}
              /> 
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
