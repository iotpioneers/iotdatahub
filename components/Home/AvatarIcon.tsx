"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Flex,
  Box,
  Heading,
  IconButton,
  Popover,
  Button,
} from "@radix-ui/themes";
import Link from "next/link";

const AvatarIcon = () => {
  const { status, data: session } = useSession();

  return (
    <IconButton color="crimson" variant="ghost" className="mr-5 z-50">
      {status === "authenticated" ? (
        <Popover.Root>
          <Popover.Trigger>
            <img
              src={session!.user!.image! || "/user.svg"}
              alt="Profile"
              className="w-10 h-10 rounded-full "
            />
          </Popover.Trigger>
          <Popover.Content>
            <Flex gap="4">
              <Box className="m-0 p-2">
                <Heading size="2" as="h3" className="mt-2 mb-3">
                  {session!.user!.email}
                </Heading>
                <div className="grid">
                  <Link
                    href="/dashboard"
                    className="text-sm text-blue-700 leading-6 mb-2"
                  >
                    Dashboard
                  </Link>
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
      ) : (
        <Button className="flexCenter gap-3 rounded-3xl border btn_dark_green max-h-10">
          <Image src="/user.svg" alt="auth" width={24} height={24} />

          <Link
            href="/login"
            className="bold-16 whitespace-nowrap cursor-pointer"
          >
            Signin
          </Link>
        </Button>
      )}
      {/* <HoverCard.Root>
        <HoverCard.Trigger>
          <img
            src="/person-4.png"
            alt="Profile"
            className="w-10 h-10 rounded-full "
          />
        </HoverCard.Trigger>
        <HoverCard.Content maxWidth="300px">
          <Flex gap="4">
            <Box className="m-0 bg-slate-100 p-5">
              <Heading size="3" as="h3" className="mb-5">
                emashyirambere1@gmail.com
              </Heading>
              <Text as="div" size="2" color="gray" className="mb-2">
                <a
                  href="/dashboard"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Dashboard
                </a>
              </Text>
              <Text as="div" size="2">
                <a
                  href="/api/auth/signout"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Sign out
                </a>
              </Text>
            </Box>
          </Flex>
        </HoverCard.Content>
      </HoverCard.Root> */}
    </IconButton>
  );
};

export default AvatarIcon;
