"use client";

import React from "react";
import { Button } from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { PricingPlanType } from "@/types";

const UpgradePricingPlan = () => {
  const [subscriptions, setSubscriptions] = React.useState<PricingPlanType[]>(
    []
  );
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing`
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
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {IsLoading && <LoadingProgressBar />}

      {subscriptions.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-5 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.name}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          <div className="flex items-center text-teal-50 h-[5.5rem] mb-6">
            {item.price && (
              <>
                <div className="h3">{item.price > 0 ? "Rwf" : ""}</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  <div className="flex">{item.price > 0 ? item.price : ""}</div>
                </div>
              </>
            )}
          </div>

          <Link
            href={
              item.price === 0
                ? "#"
                : item.name === "Enterprise"
                ? "#"
                : "https://buy.stripe.com/test_9AQ5nNdR2653a5OcMN"
            }
            className={`w-full mb-6 inline-flex items-center justify-center h-11 transition-colors mt-4 rounded-md ${
              !item.activation
                ? "bg-none text-gray-500"
                : "bg-blue-500 text-white"
            } `}
          >
            <Button
              disabled={!item.activation || item.price === 0}
              className="w-full"
            >
              {item.activation && item.name === "Enterprise"
                ? "Contact us"
                : item.price === 0
                ? "Demo"
                : item.name.includes("Enterprise")
                ? "Contact us"
                : "Get started"}
            </Button>
          </Link>

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
