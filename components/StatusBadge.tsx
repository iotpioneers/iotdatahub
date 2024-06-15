import { Badge } from "@radix-ui/themes";
import React from "react";

interface Status {
  status: string;
}

const StatusBadge = ({ status }: Status) => {
  if (status === "active") return <Badge color="green">Active</Badge>;
  if (status === "disabled") return <Badge color="red">Disabled</Badge>;
  if (status === "disconnected")
    return <Badge color="brown">Disconnected</Badge>;
  return <Badge color="brown">{status}</Badge>;
};

export default StatusBadge;
