"use client";

import React from "react";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRouter } from "next/navigation";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { PricingPlanType } from "@/types";
import { Loader2 } from "lucide-react";
import { Loader2 } from "lucide-react";

const UpgradePricingPlan = () => {
  const router = useRouter();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = React.useState<PricingPlanType[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [loadingPlanId, setLoadingPlanId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing`,
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleNavigation = async (item: PricingPlanType) => {
    setLoadingPlanId(item.id!);

    let path = "/register";
    if (item.price !== 0) {
      path = item.name.includes("Enterprise")
        ? "/organization/dashboard/contactsales"
        : `/dashboard/subscription/${item.id}`;
    }

    // Simulate a small delay to show loading state
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(path);
  };

  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap mt-5">
      {isLoading && <LoadingProgressBar />}
    <div className="flex gap-[1rem] max-lg:flex-wrap mt-5">
      {isLoading && <LoadingProgressBar />}

      {subscriptions.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-5 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.name}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          {item.price && item.price > 0 && item.name.includes("Premium") && (
            <div className="flex items-center text-teal-50 h-[5.5rem] mb-6">
              <div className="h3">Rwf</div>
              <div className="text-[5.5rem] leading-none font-bold">
                <div className="flex">{item.price}</div>
              </div>
            </div>
          )}

          <div className="w-full mb-6">
            <Button
              disabled={!item.activation || loadingPlanId === item.id}
              onClick={() => handleNavigation(item)}
              className={`w-full inline-flex items-center justify-center h-11 transition-colors mt-4 rounded-md ${
                !item.activation
                  ? "bg-none text-gray-500"
                  : "bg-blue-500 text-white"
              }`}
            >
              {loadingPlanId === item.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 justify-center items-center animate-spin" />
                  Connecting
                </>
              ) : (
                item.activation &&
                (item.name === "Enterprise"
                  ? "Contact us"
                  : item.price === 0
                    ? "Sign Up free"
                    : item.name.includes("Enterprise")
                      ? "Contact sales"
                      : "Try Premium")
              )}
            </Button>
          </div>
          </div>

          <ul>
            {item.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start py-5 border-t border-n-6"
              >
                <p className="body-2 ml-4 text-white">☑️ {feature}</p>
              </li>
            ))}
            <li className="flex items-start py-5 border-t border-n-6">
              <p className="body-2 ml-4 text-white">
                ☑️ {item.maxChannels} Maximum Channels
              </p>
            </li>
            <li className="flex items-start py-5 border-t border-n-6">
              <p className="body-2 ml-4 text-white">
                ☑️ {item.maxMessagesPerYear} Maximum Messages
              </p>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UpgradePricingPlan;
