"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";
import { Hand } from "lucide-react";
import MainCard from "../cards/MainCard";

// Greeting function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// Array of welcome messages
const welcomeMessages = [
  "Welcome to your personalized IoTDataHub dashboard. Here, you can manage your devices, monitor data, and stay connected.",
  "Explore your IoT ecosystem with ease. Monitor, manage, and optimize your connected devices all in one place.",
  "Your gateway to the world of IoT. Dive into real-time data, device management, and intelligent insights.",
  "Unleash the power of your IoT network. Streamline operations, enhance efficiency, and make data-driven decisions.",
];

const WelcomeContentCard = () => {
  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    return redirect("/login");
  }

  // Create the sequence for TypeAnimation
  const welcomeSequence = welcomeMessages.flatMap((message) => [message, 3000]);

  return (
    <MainCard
      border={false}
      content={false}
      className="bg-gradient-to-br from-orange-500 to-orange-700 text-white overflow-hidden relative"
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-400/20 rounded-full" />
      <div className="absolute -top-20 -right-4 w-32 h-32 bg-orange-400/10 rounded-full" />

      <div className="p-6 relative z-10">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
              <Hand className="h-6 w-6 text-white" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-bold mb-2">
              <TypeAnimation
                sequence={[
                  `${getGreeting()} ${
                    session?.user?.name?.split(" ")[0] || ""
                  }`,
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={1}
              />
            </div>
            <div className="text-black text-base leading-relaxed min-h-[3rem]">
              <TypeAnimation
                sequence={welcomeSequence}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          </div>
        </div>
      </div>
    </MainCard>
  );
};

export default WelcomeContentCard;
