"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";
import { useUnreadInboxNotificationsCount } from "@liveblocks/react/suspense";
import Link from "next/link";

const status = [
  { value: "all", label: "All Notification" },
  { value: "new", label: "New" },
  { value: "unread", label: "Unread" },
  { value: "other", label: "Other" },
];

const NotificationSection = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { count } = useUnreadInboxNotificationsCount();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event?.target.value) setValue(event?.target.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full bg-gray-200 hover:bg-secondary hover:text-secondary-foreground mr-1"
        >
          <Badge
            className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 text-xs text-center justify-center font-semibold text-white"
            variant="destructive"
          >
            {count > 9 ? "9+" : count}
          </Badge>
          <Bell className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 bg-white shadow-lg rounded-lg shadow-black">
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">All Notification</h4>
              <Badge variant="secondary">{count > 9 ? "9+" : count}</Badge>
            </div>
            <Link href="#">
              <Button variant="link" className="text-primary">
                Mark as all read
              </Button>
            </Link>
          </div>
          <select
            className="w-full rounded-md border p-2 text-sm"
            value={value}
            onChange={handleChange}
          >
            {status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Separator />
        <div className="h-[400px] overflow-y-auto p-2">
          <NotificationList />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSection;
