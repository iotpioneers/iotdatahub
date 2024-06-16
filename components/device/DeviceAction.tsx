import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import Link from "./Link";
import BackButton from "../BackButton";

const DeviceAction = () => {
  return (
    <div className=" flex mb-5 justify-between mr-5">
      <BackButton />
      <Button>
        <Link href="/dashboard/devices/new">New device</Link>
      </Button>
    </div>
  );
};

export default DeviceAction;
