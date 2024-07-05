"use client";
import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Skeleton from "@/components/Skeleton";

const LoadingSkeleton = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="space-y-5">
          <Skeleton
            height={200}
            className="bg-orange-200 p-5 rounded-lg shadow-md"
          />
          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <Skeleton
              height={30}
              className="flex justify-between items-center mb-5"
            />

            <div className="grid grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton
                  key={index}
                  className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex flex-col justify-between h-32"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-5">
              <Skeleton width="100%" height={30} />
            </h2>
            <div className="flex space-x-5 overflow-x-auto overflow-hidden">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton width={70} height={50} className="rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-lg border">
            <h2 className="text-xl font-semibold mb-5">
              <Skeleton width="100%" height={30} />
            </h2>
            <div style={{ width: "100%", height: 200 }}>
              <Skeleton width="100%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
