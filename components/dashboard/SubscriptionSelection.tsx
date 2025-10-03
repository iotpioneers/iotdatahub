"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PricingList from "../Home/components/PricingList";
import { PricingPlanType } from "@/types";

const SubscriptionSelection: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<PricingPlanType[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<PricingPlanType | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing`
        );
        setSubscriptions(response.data);
      } catch (error) {
        throw new Error("Error fetching subscriptions");
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSubscriptionSelect = (subscription: PricingPlanType) => {
    setSelectedSubscription(subscription);
  };

  const handleSubscriptionSubmit = async () => {
    if (selectedSubscription) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`,
          selectedSubscription
        );
        router.push("/dashboard/channels");
      } catch (error) {
        throw new Error("Error updating subscription");
      }
    }
  };

  return (
    <div>
      <h2>Choose Your Subscription</h2>
      <PricingList onSelect={handleSubscriptionSelect} />
      <button onClick={handleSubscriptionSubmit}>
        {selectedSubscription
          ? `Subscribe to ${selectedSubscription.name}`
          : "Select a Subscription"}
      </button>
    </div>
  );
};

export default SubscriptionSelection;
