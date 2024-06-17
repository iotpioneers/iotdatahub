"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, DropdownMenu, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Skeleton } from "@/components";
import Link from "next/link";

const SigninButton = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  // if (status === "loading") return <Skeleton width="3rem" />;

  console.log(session);

  const handleSignIn = () => router.push("/login");
  return (
    <Box>
      {status === "authenticated" ? (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
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
      )}
    </Box>
  );
};

export default SigninButton;
