"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/context";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import UpgradePlanCardAlert from "@/components/sidebar/UpgradePlanCardAlert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Redux store types (keep these as needed for your Redux setup)
export type RootState = {
  customization: {
    borderRadius: number;
  };
};

const ProfileSection = () => {
  const { state } = useGlobalState();
  const { status, data: session } = useSession();
  const router = useRouter();
  const customization = useSelector((state: RootState) => state.customization);

  const [open, setOpen] = useState(false);
  const { currentUser } = state;

  const handleLogout = async () => {
    router.push("/api/auth/signout");
  };

  const handleNavigation = (route: string) => {
    setOpen(false);
    if (route && route !== "") {
      router.push(route);
    }
  };

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      return;
    }
  }, [status, router, state]);

  const userName = currentUser?.name || session?.user?.name;
  const userEmail = currentUser?.email || session?.user?.email;
  const userImage = currentUser?.image || session?.user?.image;

  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 px-2 rounded-full border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={userImage || ""} alt={userName || ""} />
                  <AvatarFallback className="bg-orange-50 text-primary-foreground font-bold">
                    {(userName &&
                      userName.charAt(0).toUpperCase() +
                        userName.charAt(1).toUpperCase()) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <IconSettings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Account settings</p>
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="w-96 p-0 bg-white shadow-lg rounded-lg shadow-black"
          align="end"
          sideOffset={14}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex">
                <Avatar className="h-12 w-12 mr-2">
                  <AvatarImage src={userImage || ""} alt={userName || ""} />
                  <AvatarFallback className="bg-orange-50 text-primary-foreground font-bold">
                    {(userName &&
                      userName.charAt(0).toUpperCase() +
                        userName.charAt(1).toUpperCase()) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2 pb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold">{userName}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>

              <Separator />

              <ScrollArea className="max-h-96 mt-4">
                <div className="space-y-4">
                  {/* Upgrade Plan Card */}
                  <Card className="bg-primary/5">
                    <UpgradePlanCardAlert />
                  </Card>

                  <Separator />

                  {/* Navigation Menu */}
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => handleNavigation("/dashboard/settings")}
                    >
                      <IconSettings className="mr-3 h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => handleNavigation("/dashboard/account")}
                    >
                      <IconUser className="mr-3 h-4 w-4" />
                      <span className="text-sm">Account</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 text-left text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <IconLogout className="mr-3 h-4 w-4" />
                      <span className="text-sm">Logout</span>
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default ProfileSection;
