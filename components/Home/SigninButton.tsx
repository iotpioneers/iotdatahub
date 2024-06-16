"use client";

import { Button, Text } from "@radix-ui/themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SigninButton = () => {
  const router = useRouter();
  const handleSignIn = () => router.push("/login");
  return (
    <Button
      className="flexCenter gap-3 rounded-full border btn_dark_green"
      onClick={handleSignIn}
    >
      <Image src="/user.svg" alt="Login" width={24} height={24} />
      <Text className="bold-16 whitespace-nowrap cursor-pointer">Login</Text>
    </Button>
  );
};

export default SigninButton;
