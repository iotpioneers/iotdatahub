import { Button } from "@radix-ui/themes";
import React from "react";
import Link from "./Link";

const DeviceAction = () => {
  return (
    <div className="mb-5">
      <Button>
        <Link href="/#">New device</Link>
      </Button>
    </div>
  );
};

export default DeviceAction;
