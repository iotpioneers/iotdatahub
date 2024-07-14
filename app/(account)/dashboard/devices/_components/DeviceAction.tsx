import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import Link from "../../../../../components/Link";
import BackButton from "../../../../../components/BackButton";

const DeviceAction = () => {
  return (
    <div className=" flex w-full mb-5 justify-between">
      <BackButton />
      <Button>
        <Link href="/dashboard/devices/new">New device</Link>
      </Button>
    </div>
  );
};

export default DeviceAction;
