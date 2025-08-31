import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// project imports
import SkeletonTotalDatGeneratedLightCard from "../cards/Skeleton/SkeletonTotalDatGeneratedLightCard";

// ==============================|| DASHBOARD - TOTAL DATA GENERATED CARD ||============================== //

interface TotalDataGeneratedLightCardProps {
  icon: JSX.Element;
  label: string;
  total: number;
  isLoading: boolean;
}

const formatTotal = (total: number): string => {
  if (total === 0) {
    return "No data generated yet";
  } else if (total >= 1_000_000) {
    return (total / 1_000_000).toFixed(1) + "M generated";
  } else if (total >= 1_000) {
    return (total / 1_000).toFixed(1) + "k generated";
  } else {
    return total.toString();
  }
};

const TotalDataGeneratedCard = ({
  isLoading,
  total,
  icon,
  label,
}: TotalDataGeneratedLightCardProps) => {
  return (
    <>
      {isLoading ? (
        <SkeletonTotalDatGeneratedLightCard />
      ) : (
        <Card className="border relative overflow-hidden bg-white">
          {/* Background decorative circles */}
          <div
            className="absolute w-52 h-52 rounded-full opacity-20 -top-8 -right-44"
            style={{
              background:
                "linear-gradient(210.04deg, rgba(251, 146, 60, 0.6) -50.94%, rgba(144, 202, 249, 0) 83.49%)",
            }}
          ></div>
          <div
            className="absolute w-52 h-52 rounded-full opacity-15 -top-40 -right-32"
            style={{
              background:
                "linear-gradient(140.9deg, rgba(251, 146, 60, 0.6) -14.02%, rgba(144, 202, 249, 0) 70.50%)",
            }}
          ></div>

          <CardContent className="p-4 relative z-10">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-orange-100">
                <AvatarFallback
                  className={`bg-orange-100 ${
                    label === "Meeting attends"
                      ? "text-red-700"
                      : "text-orange-700"
                  }`}
                >
                  {icon}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-xl font-medium text-gray-900">
                  {formatTotal(total)}
                </h4>
                <p className="text-gray-500 text-sm mt-1">{label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TotalDataGeneratedCard;
