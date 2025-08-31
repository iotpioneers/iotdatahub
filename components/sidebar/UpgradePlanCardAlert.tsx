"use client";

import { memo, useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UserSubscriptionData } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import Link from "next/link";

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(date));

const ProgressWithLabel = ({
  value,
  remainingDays,
}: {
  value: number;
  remainingDays: number | null;
}) => {
  const getProgressColor = () => {
    if (remainingDays !== null && remainingDays <= 10) {
      return "bg-yellow-500";
    } else if (value >= 80) {
      return "bg-red-500";
    } else {
      return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-3 mt-6">
      <div className="flex justify-between items-center">
        <h6 className="text-sm font-medium text-primary/80">Usage</h6>
        {Math.round(value) > 0 ? (
          <span className="text-sm font-medium">
            {`${Math.round(value)}%`} of limit
          </span>
        ) : (
          <span className="text-sm font-medium text-red-500">Exhausted</span>
        )}
      </div>
      <Progress
        value={value}
        className="h-2.5 bg-background"
        // You can customize the progress color with CSS custom properties or className
      />
    </div>
  );
};

const UpgradePlanCardAlert = () => {
  const { status, data: session } = useSession();
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(
    null,
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      if (status !== "loading" && status === "authenticated") {
        try {
          const res = await axios.get(
            process.env.NEXT_PUBLIC_BASE_URL + `/api/pricing/current`,
          );
          setSubscription(res.data);
        } catch (error) {
          return;
        }
      }
    };

    fetchSubscription();
  }, [status, session?.user.subscriptionId]);

  // Calculate the remaining days before subscription expiration
  const currentPeriodStart = subscription?.currentPeriodStart
    ? new Date(subscription.currentPeriodStart).getTime()
    : null;
  const currentPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).getTime()
    : null;

  const remainingDays =
    currentPeriodStart !== null && currentPeriodEnd !== null
      ? Math.floor(
          (currentPeriodEnd - currentPeriodStart) / (1000 * 60 * 60 * 24),
        )
      : null;

  const usagePercentage =
    remainingDays !== null &&
    currentPeriodStart !== null &&
    currentPeriodEnd !== null
      ? Math.round(
          ((currentPeriodEnd - Date.now()) /
            (currentPeriodEnd - currentPeriodStart)) *
            100,
        )
      : 0;

  if (status !== "loading" && status === "unauthenticated") {
    return null;
  }

  if (!subscription) {
    return (
      <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute -top-20 -right-24 w-40 h-40 bg-primary/10 rounded-full" />

        <CardContent className="p-4 relative">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10 bg-background border-2 border-primary/20">
              <AvatarFallback className="bg-background text-primary">
                <Sparkles className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <h5 className="text-sm font-semibold text-primary/90">
                Free Plan
              </h5>
              <p className="text-xs text-muted-foreground">Your current plan</p>
            </div>
          </div>

          <div className="mt-4 flex justify-start">
            <Link href="/dashboard/subscription">
              <Button
                size="sm"
                className={`shadow-none ${
                  remainingDays !== null && remainingDays <= 10
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                Upgrade
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-24 w-40 h-40 bg-primary/10 rounded-full" />

      <CardContent className="p-4 relative">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10 bg-background border-2 border-primary/20">
            <AvatarFallback className="bg-background text-primary">
              <Sparkles className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <h5 className="text-sm font-semibold text-primary/90">
              {subscription.type}
            </h5>
            <p className="text-xs text-muted-foreground">Your current plan</p>
          </div>
        </div>

        {subscription.type !== "Free" && (
          <ProgressWithLabel
            value={usagePercentage}
            remainingDays={remainingDays}
          />
        )}

        <div className="mt-4 flex justify-start">
          <Link href="/dashboard/subscription">
            <Button
              size="sm"
              className={`shadow-none ${
                remainingDays !== null && remainingDays <= 10
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {subscription.type === "Free" ||
              subscription.type === "" ||
              subscription.type === "null"
                ? "Upgrade"
                : remainingDays !== null && remainingDays <= 10
                  ? "Renew"
                  : "Manage"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(UpgradePlanCardAlert);
