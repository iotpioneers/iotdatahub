"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Flex, Box, Heading, IconButton, Popover } from "@radix-ui/themes";
import Link from "next/link";
import { Avatar } from "@radix-ui/react-avatar";

const AvatarIcon = () => {
  const { status, data: session } = useSession();

  // const username_letter = session!.user!.name!.split("")[0];

  return (
    <IconButton color="crimson" variant="ghost" className="z-10">
      {status === "authenticated" && (
        <Popover.Root>
          <Popover.Trigger>
            <Avatar className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center">
              {session!.user!.image ? (
                <img
                  src={session!.user!.image}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                session!.user!.name!.split("")[0].toUpperCase()
              )}
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
