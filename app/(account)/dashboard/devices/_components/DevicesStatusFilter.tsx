"use client";

import React from "react";
import { DeviceStatus } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const statuses: { label: string; value?: DeviceStatus }[] = [
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
];

const DevicesStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex justify-center items-center text-black border border-color-6 rounded-md px-3 py-1">
      <Select.Root
        defaultValue={searchParams.get("status") || ""}
        onValueChange={(status) => {
          const params = new URLSearchParams();
          if (status) params.append("status", status);
          if (searchParams.get("orderBy"))
            params.append("orderBy", searchParams.get("orderBy")!);

          const query = params.size ? "?" + params.toString() : "";
          router.push("/dashboard/devices" + query);
        }}
      >
        <Select.Trigger placeholder="Filter by status..." />
        <Select.Content className="flex justify-between items-center bg-white text-black mt-16 gap-2 p-3 rounded-md">
          {statuses.map((status) => (
            <Select.Item
              key={status.value}
              value={status.value || ""}
              className="flex justify-between items-center gap-2"
            >
              {status.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default DevicesStatusFilter;
