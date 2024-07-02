import { Badge } from "@radix-ui/themes";
import React from "react";

interface Status {
  status: string;
}

const StatusBadge = ({ status }: Status) => {
  if (status === "ONLINE") return <Badge color="green">Active</Badge>;
  if (status === "OFFLINE") return <Badge color="red">OFFLINE</Badge>;

  return <Badge color="brown">{status}</Badge>;
};

export default StatusBadge;
