import { Button, Flex } from "@radix-ui/themes";
import React from "react";
import Link from "./Link";
import BackButton from "../BackButton";

const ChannelAction = () => {
  return (
    <div className=" flex mb-5 justify-between mr-5 gap-3">
      <BackButton />
      <Button>
        <Link href="/dashboard/channels/new">New channel</Link>
      </Button>
    </div>
  );
};

export default ChannelAction;
