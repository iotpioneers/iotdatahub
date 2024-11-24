import * as React from "react";
import type { Metadata } from "next";

import { config } from "@/config";
import { GuestGuard } from "@/components/Auth/guest-guard";
import { Layout } from "@/components/Auth/layout";
import { SignUpForm } from "@/components/Auth/sign-up-form";

export const metadata = {
  title: `Sign up | Auth | ${config.site.name}`,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        <SignUpForm />
      </GuestGuard>
    </Layout>
  );
}
