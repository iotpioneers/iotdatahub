"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast-provider";
import Link from "next/link";
import type { Channel } from "@/types";
import axios from "axios";
import LoadingProgressBar from "@/components/loading-progress-bar";
import { ActionModal } from "@/components/dashboard/ActionModal";
import { useSession } from "next-auth/react";
import { deleteChannel } from "@/lib/actions/room.actions";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(new Date(date));

const ChannelListTable = ({
  initialChannels,
}: {
  initialChannels: Channel[] | [];
}) => {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [loading, setLoading] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const toast = useToast();
  const { status, data: session } = useSession();
  const email = session?.user?.email;

  const fetchChannels = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels`
      );
      if (response.status === 200) {
        setChannels(response.data);
      }
    } catch (error) {
      toast.toast({
        type: "error",
        message: "Failed to fetch updated channel data",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchChannels();
    }
  }, [fetchChannels, status, updateTrigger]);

  const updateChannelAccess = async (channelId: string, newAccess: string) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelId}`,
        {
          access: newAccess,
        }
      );

      if (response.status !== 200) {
        toast.toast({
          type: "error",
          message: response.data.message,
        });
        return;
      }

      toast.toast({
        type: "success",
        message: "Channel access updated successfully",
      });
      setUpdateTrigger((prev) => prev + 1);
    } catch (error) {
      toast.toast({
        type: "error",
        message: "Failed to update channel access",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = () => {
    setLoading(true);
  };

  const renderAccessBadge = (channel: Channel) => {
    const access = channel.access;
    let variant: "default" | "secondary" | "destructive" | "outline" =
      "default";
    let label = "Unknown";

    switch (access) {
      case "PUBLIC":
        variant = "secondary";
        label = "Public";
        break;
      case "PRIVATE":
        variant = "outline";
        label = "Private";
        break;
      default:
        break;
    }

    const newAccess = access === "PUBLIC" ? "PRIVATE" : "PUBLIC";
    const newLabel = newAccess === "PUBLIC" ? "Public" : "Private";

    return (
      <ActionModal
        triggerComponent={
          <Badge variant={variant} className="cursor-pointer">
            {label}
          </Badge>
        }
        title={`Change Access to ${newLabel}`}
        description={`Are you sure you want to change the access of "${channel.name}" to ${newLabel}?`}
        confirmButtonText="Change Access"
        onConfirm={() => updateChannelAccess(channel.id, newAccess)}
        iconSrc="/icons/edit.svg"
      />
    );
  };

  if (status === "loading") {
    return <LoadingProgressBar />;
  }

  if (status === "unauthenticated" || !channels || channels.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {loading && <LoadingProgressBar />}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/justify.svg"
                      alt="channel"
                      className="w-6 h-6"
                    />
                    <Link
                      href={`/dashboard/channels/${channel.id}`}
                      className="text-blue-500 hover:underline"
                      onClick={handleLinkClick}
                    >
                      {channel.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={channel.ownerImage || "/placeholder.svg"}
                        alt={channel.ownerEmail}
                      />
                      <AvatarFallback>
                        {channel.ownerEmail[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {email && email === channel.ownerEmail
                        ? "Me"
                        : channel.ownerEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{renderAccessBadge(channel)}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(channel.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <ActionModal
                    triggerComponent={
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    }
                    title="Delete Channel"
                    description={`Are you sure you want to delete the channel "${channel.name}"?`}
                    confirmButtonText="Delete"
                    onConfirm={() => deleteChannel(channel.id)}
                    iconSrc="/icons/delete.svg"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChannelListTable;
