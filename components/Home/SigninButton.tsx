"use client";

import { Box, Button, Text } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Link } from "../device";

const SigninButton = () => {
  const router = useRouter();

  const { status, data: session } = useSession();

  const AuthUrl = status !== "authenticated" ? "/login" : "/api/auth/signout";
  const AuthLabel = status !== "authenticated" ? "Signin" : "Logout";

  const handleSignIn = () => router.push(AuthUrl);
  return (
    <Box>
      <Button
        className="flexCenter gap-3 rounded-3xl border btn_dark_green"
        onClick={handleSignIn}
      >
        <Image src="/user.svg" alt={AuthLabel} width={24} height={24} />
        <Text className="bold-16 whitespace-nowrap cursor-pointer">
          {AuthLabel}
        </Text>
      </Button>
    </Box>
  );
};

export default SigninButton;
