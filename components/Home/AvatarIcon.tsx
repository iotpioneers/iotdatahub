"use client";

import React from "react";
import { useSession } from "next-auth/react";
import {
  Flex,
  Box,
  Heading,
  IconButton,
  Popover,
  Button,
} from "@radix-ui/themes";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@radix-ui/react-avatar";

const AvatarIcon = () => {
  const { status, data: session } = useSession();

  return (
    <IconButton color="crimson" variant="ghost" className="mr-5 z-50">
      {status === "authenticated" && (
        <Popover.Root>
          <Popover.Trigger>
            <Avatar className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center">
              <img
                src={session!.user!.image! || "user.svg"}
                alt="Profile"
                className="rounded-full"
              />
            </Avatar>
          </Popover.Trigger>
          <Popover.Content className="bg-white border shadow-md rounded-lg z-50 px-5">
            <Flex gap="4">
              <Box className="m-0 p-2">
                <Heading size="2" as="h3" className="mt-2 mb-3 text-n-8">
                  {session!.user!.email}
                </Heading>
                <div className="grid">
                  <Link
                    href="/api/auth/signout"
                    className="text-sm text-blue-700  leading-6 mb-2"
                  >
                    Sign out
                  </Link>
                </div>
              </Box>
            </Flex>
          </Popover.Content>
        </Popover.Root>
      )}
    </IconButton>
  );
};

export default AvatarIcon;
