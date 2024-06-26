import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const cardStyle = "flex flex-col justify-between p-5"; // Removed fixed height and width

const subscriptionPlans = [
  {
    name: "Free",
    price: "RWF 0/month",
    buttonText: "Your current plan",
    buttonDisabled: true,
    features: [
      "✓ Basic data ingestion",
      "✓ Annual usage capped",
      "✓ Max up to 3 channels",
      "✓ Basic AI analysis",
      "✓ Limited Private channel sharing",
      "✓ Community support",
    ],
  },
  {
    name: "Standard",
    price: "RWF 1000/month",
    buttonText: "Upgrade to Standard",
    buttonDisabled: false,
    features: [
      "✓ Enhanced data ingestion",
      "✓ Scalable for larger projects",
      "✓ 250 channels per unit",
      "✓ Advanced AI analysis",
      "✓ Private channel sharing: Unlimited",
      "✓ Standard technical support",
    ],
  },
  {
    name: "Premium",
    price: "RWF 2000/month*",
    buttonText: "Upgrade to Premium",
    buttonDisabled: false,
    features: [
      "✓ Everything in Standard, and:",
      "✓ Unlimited data ingestion",
      "✓ Unlimited data storage",
      "✓ Custom AI analysis",
      "✓ API access for integration",
      "✓ Priority email support",
    ],
    note: "* Price billed annually, minimum 2 users",
  },
];

const UpgradePlanPage = () => {
  return (
    <div className="flex flex-col items-center text-center w-full px-4">
      <Heading className="text-black text-2xl mb-5">Upgrade your plan</Heading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptionPlans.map((plan, index) => (
          <Card key={index} className={cardStyle}>
            <Flex direction="column" gap="2">
              <Heading as="h3">{plan.name}</Heading>
              <Text size="2">{plan.price}</Text>
              <Link href="https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE">
                <Button
                  disabled={plan.buttonDisabled}
                  className={`mt-4 ${
                    plan.buttonDisabled
                      ? "bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white"
                  } py-2 rounded`}
                >
                  {plan.buttonText}
                </Button>
              </Link>
              {plan.features.map((feature, idx) => (
                <Text key={idx}>{feature}</Text>
              ))}
              {plan.note && (
                <Text size="3" className="mt-4">
                  {plan.note}
                </Text>
              )}
            </Flex>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlanPage;
