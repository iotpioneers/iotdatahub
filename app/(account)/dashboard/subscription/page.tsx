import { Button, Text } from "@radix-ui/themes";
import { Metadata } from "next";
import Link from "next/link";

const subscriptionPlans = [
  {
    id: 0,
    name: "Basic",
    price: "0",
    description: "Data storage, device control",
    buttonText: "Your current plan",
    buttonDisabled: true,
    features: [
      "Basic data ingestion",
      "Annual usage capped",
      "Max up to 3 channels",
      "Basic AI analysis",
      "Limited Private channel sharing",
      "Community support",
    ],
  },
  {
    id: 1,
    name: "Premium",
    price: "99.9",
    description: "Data storage, device control",
    buttonText: "Upgrade to Premium",
    buttonDisabled: false,
    features: [
      "Enhanced data ingestion",
      "Scalable for larger projects",
      "250 channels per unit",
      "Advanced AI analysis",
      "Private channel sharing: Unlimited",
      "Standard technical support",
    ],
  },
  {
    id: 2,
    name: "Entreprise",
    price: "999.9",
    description: "Data storage, device control",
    buttonText: "Contact sales",
    buttonDisabled: false,
    features: [
      "Everything in Standard, and:",
      "Unlimited data ingestion",
      "Unlimited data storage",
      "Custom AI analysis",
      "API access for integration",
      "Priority email support",
    ],
    note: "* Price billed annually, minimum 2 users",
  },
];

export default function PricingList() {
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {subscriptionPlans.map((item) => (
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
                <div className="h3">$</div>
                <div className="text-[5.5rem] leading-none font-bold">
                  <div className="flex">{item.price}</div>
                </div>
              </>
            )}
          </div>

          <Link
            href={
              item.buttonDisabled
                ? "#"
                : "https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE"
            }
            className={`w-full mb-6 inline-flex items-center justify-center h-11 transition-colors mt-4 rounded-md ${
              item.buttonDisabled
                ? "bg-none text-gray-500"
                : "bg-blue-500 text-white"
            } `}
          >
            <Button disabled={item.buttonDisabled} className="w-full">
              {item.buttonText}
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
            {item.note && (
              <Text size="3" className="mt-4 text-orange-600">
                Note: {item.note}
              </Text>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing - IoTDataHub - Dashboard",
  description:
    "The pricing page of the IoTDataHub platform. Explore our latest pricing packages.",
};
