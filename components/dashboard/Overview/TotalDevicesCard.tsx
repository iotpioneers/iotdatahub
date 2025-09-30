import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDownRight, Cpu } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// project imports
import SkeletonTotalChannelDetailsCard from "../cards/Skeleton/SkeletonTotalChannelDetailsCard";
import { Device } from "@/types/uni-types";

// ==============================|| DASHBOARD - TOTAL DEVICES CARD ||============================== //

interface TotalDevicesCardProps {
  isLoading: boolean;
  devices: Device[] | null;
}

const TotalDevicesCard: React.FC<TotalDevicesCardProps> = ({
  isLoading,
  devices,
}) => {
  const chartData = useMemo(() => {
    if (!devices) return [];

    return devices.map((device, index) => ({
      x: index,
      y: device.status === "ONLINE" ? 1 : 0,
    }));
  }, [devices]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalChannelDetailsCard />
      ) : (
        <Card className="bg-blue-900 text-white border-none relative overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute w-52 h-52 rounded-full opacity-20 -top-20 sm:-top-24 -right-32 sm:-right-24 bg-blue-700"></div>
          <div className="absolute w-52 h-52 rounded-full opacity-10 -top-36 sm:-top-32 -right-16 sm:-right-4 bg-blue-700"></div>

          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12 bg-blue-700">
                  <AvatarFallback className="bg-blue-700 text-white">
                    <Cpu className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-3xl font-medium">
                      {devices ? devices.length : 0}
                    </h3>
                    <Avatar className="h-8 w-8 bg-blue-200 cursor-pointer">
                      <AvatarFallback className="bg-blue-200 text-blue-900">
                        <ArrowDownRight className="h-4 w-4 rotate-45" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-lg font-medium text-blue-200">
                    Total Devices
                  </p>
                </div>

                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#ffffff"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TotalDevicesCard;
