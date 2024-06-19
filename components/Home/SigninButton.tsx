"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  DropdownMenu,
  Select,
  Text,
} from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const SigninButton = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  console.log(session);

  const handleSignIn = () => router.push("/login");
  return (
    <Box>
      <Button className="flexCenter gap-3 rounded-3xl border btn_dark_green max-h-10">
        <Image src="/user.svg" alt="auth" width={24} height={24} />

        {status === "authenticated" ? (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Select.Root defaultValue="user" size="3">
              <Select.Trigger />
              <Select.Content className="bg-slate-600 w-48 px-3 mr-56">
                <Select.Group>
                  <Select.Label>Account</Select.Label>
                  <Select.Item value="user">User</Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Label>
                    <a
                      href="/dashboard"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Dashboard
                    </a>
                  </Select.Label>
                  <Select.Label>
                    <a
                      href="/api/auth/signout"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Sign out
                    </a>
                  </Select.Label>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        ) : (
          <Link
            href="/login"
            className="bold-16 whitespace-nowrap cursor-pointer"
          >
            Signin
          </Link>
        )}
      </Button>
      {/* {status === "authenticated" ? (
        <>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Select.Root defaultValue="user">
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Account</Select.Label>
                  <Select.Item value="user">User</Select.Item>
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Label>
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Sign out{" "}
                      <span aria-hidden="true" className="px-2">
                        &rarr;
                      </span>
                    </a>
                  </Select.Label>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <>
                <Avatar
                  src={session.user!.image!}
                  fallback={
                    <Image src="/user.svg" alt="user" width={24} height={24} />
                  }
                  size="9"
                  radius="full"
                  className="cursor-pointer bg-slate-500 flexCenter rounded-full border w-10 h-10 max-h-10"
                  referrerPolicy="no-referrer"
                />
              </>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text size="2">{session!.user!.email}</Text>
              </DropdownMenu.Label>
              <DropdownMenu.Item>
                <Link href="/api/auth/signout">Log out</Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </>
      ) : (
        <Button
          className="flexCenter gap-3 rounded-3xl border btn_dark_green max-h-10"
          onClick={handleSignIn}
        >
          <Image src="/user.svg" alt="auth" width={24} height={24} />
          <Text className="bold-16 whitespace-nowrap cursor-pointer">
            Signin
          </Text>
        </Button>
      )} */}
    </Box>
  );
};

export default SigninButton;
