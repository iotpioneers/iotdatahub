import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, Radio } from "lucide-react";

// project imports
import { Channel } from "@/types";
import SkeletonTotalChannelDetailsCard from "../cards/Skeleton/SkeletonTotalChannelDetailsCard";

// ===========================|| DASHBOARD DEFAULT - CHANNEL CARD ||=========================== //

interface TotalChannelCardProps {
  isLoading: boolean;
  channels: Channel[] | null;
}

const TotalChannelCard = ({ isLoading, channels }: TotalChannelCardProps) => {
  return (
    <>
      {isLoading ? (
        <SkeletonTotalChannelDetailsCard />
      ) : (
        <Card className="bg-purple-900 text-white border-none relative overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute w-52 h-52 rounded-full opacity-20 -top-20 sm:-top-24 -right-32 sm:-right-24 bg-purple-700"></div>
          <div className="absolute w-52 h-52 rounded-full opacity-10 -top-36 sm:-top-32 -right-16 sm:-right-4 bg-purple-700"></div>

          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <Avatar className="h-12 w-12 bg-purple-700">
                  <AvatarFallback className="bg-purple-700 text-white">
                    <Radio className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center space-x-2">
                <h3 className="text-3xl font-medium">
                  {channels ? channels.length : "No channel yet"}
                </h3>
                {channels && channels.length > 0 && (
                  <Avatar className="h-8 w-8 bg-purple-200 cursor-pointer">
                    <AvatarFallback className="bg-purple-200 text-purple-900">
                      <ArrowUpRight className="h-4 w-4 rotate-45" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>

              <p className="text-lg font-medium text-purple-200">
                Total Channels
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TotalChannelCard;
