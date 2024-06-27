import React from "react";
import Skeleton from "@/components/Skeleton"; // Import your Skeleton component
import { Disclosure } from "@headlessui/react";
import Link from "next/link";

function SideBarSkeleton() {
  return (
    <div>
      <Disclosure as="nav">
        <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200 border-r border-gray-10 border-5">
          <div className="flex flex-col justify-start item-center">
            <h1 className="text-base text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 w-full pb-2">
              <Skeleton width={180} height={30} />
            </h1>
            <div className="my-4 border-b border-gray-100 pb-4">
              <Link href="/dashboard">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
              <Link href="/dashboard/devices">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
              <Link href="/dashboard/channels">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
            </div>
            {/* setting  */}
            <div className="my-4 border-b border-gray-100 pb-4">
              <Link href="/dashboard/subscription">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
              <Link href="#">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
            </div>
            {/* logout */}
            <div className="my-4">
              <Link href="#">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
              <Link href="/api/auth/signout">
                <div className="flex mb-2 justify-start items-center gap-4 pl-2 border border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                  <Skeleton width={24} height={24} />
                  <Skeleton width={135} height={24} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
}

export default SideBarSkeleton;
