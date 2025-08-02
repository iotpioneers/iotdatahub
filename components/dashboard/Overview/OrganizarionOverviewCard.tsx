import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// project imports
import SkeletonTotalDatGeneratedLightCard from "../cards/Skeleton/SkeletonTotalDatGeneratedLightCard";

// assets
import { Organization } from "@/types";
import { EmployeeMember } from "@/types/employees-member";

// ==============================|| DASHBOARD - ORGANIZATION OVERVIEW CARD ||============================== //

interface OrganizationOverviewProps {
  isLoading: boolean;
  organization: Organization | null;
  members: EmployeeMember[] | null;
}

const OrganizationOverviewCard: React.FC<OrganizationOverviewProps> = ({
  isLoading,
  organization,
  members,
}) => {
  return (
    <>
      {isLoading ? (
        <SkeletonTotalDatGeneratedLightCard />
      ) : (
        <Card className="bg-blue-900 text-white border-none relative overflow-hidden">
          {/* Background decorative circles */}
          <div
            className="absolute w-52 h-52 rounded-full opacity-30 -top-8 -right-44"
            style={{
              background:
                "linear-gradient(210.04deg, rgba(59, 130, 246, 0.5) -50.94%, rgba(144, 202, 249, 0) 83.49%)",
            }}
          ></div>
          <div
            className="absolute w-52 h-52 rounded-full opacity-20 -top-40 -right-32"
            style={{
              background:
                "linear-gradient(140.9deg, rgba(59, 130, 246, 0.5) -14.02%, rgba(144, 202, 249, 0) 77.58%)",
            }}
          ></div>

          <CardContent className="p-4 relative z-10">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-blue-800">
                <AvatarFallback className="bg-blue-800 text-white">
                  <Users className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="text-xl font-medium text-white">
                  {organization?.name}
                </h4>
                <p className="text-blue-200 text-sm mt-1">
                  {members && members.length > 1
                    ? `${members?.length} Members`
                    : "1 Member"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default OrganizationOverviewCard;
