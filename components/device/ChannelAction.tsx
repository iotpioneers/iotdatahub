// device/ChannelAction.tsx

import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React, { useState } from "react";

const ChannelAction = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex mb-5 justify-between mr-5 gap-3">
      <Link href="/dashboard/channels/new">
        <Button disabled={loading}>
          {loading ? "Loading..." : "New channel"}
        </Button>
      </Link>
    </div>
  );
};

export default ChannelAction;
