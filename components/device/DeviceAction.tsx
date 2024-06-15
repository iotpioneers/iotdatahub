import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import Link from "./Link";
import BackButton from "./BackButton";

const DeviceAction = () => {
  return (
    <div className="mb-5">
      <Flex gap={"3"}>
        <BackButton />
        <Button>
          <Link href="/dashboard/devices/new">New device</Link>
        </Button>
      </Flex>
    </div>
  );
};

export default DeviceAction;
