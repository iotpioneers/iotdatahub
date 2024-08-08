import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@radix-ui/themes";

const NotificationIcon = () => {
  return (
    <IconButton color="crimson" variant="ghost">
      <BellIcon className="h-6 w-6 text-gray-500" />
    </IconButton>
  );
};

export default NotificationIcon;
