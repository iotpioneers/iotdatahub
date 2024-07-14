// import { Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
// import Link from "next/link";
// import React from "react";

import { Button, Text } from "@radix-ui/themes";
import Link from "next/link";

// const cardStyle = "flex flex-col justify-between p-5"; // Removed fixed height and width

// const subscriptionPlans = [
//   {
//     id: 0,
//     name: "Free",
//     price: "$ 0",
//     buttonText: "Your current plan",
//     buttonDisabled: true,
//     features: [
//       "✓ Basic data ingestion",
//       "✓ Annual usage capped",
//       "✓ Max up to 3 channels",
//       "✓ Basic AI analysis",
//       "✓ Limited Private channel sharing",
//       "✓ Community support",
//     ],
//   },
//   {
//     id: 1,
//     name: "Standard",
//     price: "$ 99.9 monthly",
//     buttonText: "Upgrade to Standard",
//     buttonDisabled: false,
//     features: [
//       "✓ Enhanced data ingestion",
//       "✓ Scalable for larger projects",
//       "✓ 250 channels per unit",
//       "✓ Advanced AI analysis",
//       "✓ Private channel sharing: Unlimited",
//       "✓ Standard technical support",
//     ],
//   },
//   {
//     id: 2,
//     name: "Entreprise",
//     price: "$ 999.9 annually*",
//     buttonText: "Upgrade to Premium",
//     buttonDisabled: false,
//     features: [
//       "✓ Everything in Standard, and:",
//       "✓ Unlimited data ingestion",
//       "✓ Unlimited data storage",
//       "✓ Custom AI analysis",
//       "✓ API access for integration",
//       "✓ Priority email support",
//     ],
//     note: "* Price billed annually, minimum 2 users",
//   },
// ];

// const UpgradePlanPage = () => {
//   return (
//     <div className="flex flex-col items-center text-center w-full px-4">
//       <Heading className="text-black text-2xl mb-5">Upgrade your plan</Heading>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {subscriptionPlans.map((plan, index) => (
//           <Card key={index} className={cardStyle}>
//             <Flex direction="column" gap="2">
//               <Heading as="h3">{plan.name}</Heading>
//               <Text size="2">{plan.price}</Text>
//               <Link href="https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE">
//                 <Button
//                   disabled={plan.buttonDisabled}
//                   className={`mt-4 ${
//                     plan.buttonDisabled
//                       ? "bg-gray-200 text-gray-500"
//                       : "bg-blue-500 text-white"
//                   } py-2 rounded`}
//                 >
//                   {plan.buttonText}
//                 </Button>
//               </Link>
//               {plan.features.map((feature, idx) => (
//                 <Text key={idx}>{feature}</Text>
//               ))}
//               {plan.note && (
//                 <Text size="3" className="mt-4">
//                   {plan.note}
//                 </Text>
//               )}
//             </Flex>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UpgradePlanPage;

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

const PricingList = () => {
  return (
    <div className="flex gap-[1rem] max-lg:flex-wrap">
      {subscriptionPlans.map((item) => (
        <div
          key={item.id}
          className="w-[19rem] max-lg:w-full h-full px-6 bg-n-8 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
        >
          <h4 className="h4 mb-4">{item.name}</h4>

          <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
            {item.description}
          </p>

          <div className="flex items-center h-[5.5rem] mb-6">
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
            href="https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE"
            className={`w-full mb-6 inline-flex items-center justify-center h-11 transition-colors mt-4 rounded-md ${
              item.buttonDisabled
                ? "bg-gray-200 text-gray-500"
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
};

export default PricingList;
