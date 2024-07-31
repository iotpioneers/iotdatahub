import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import OrganizationMembers from "./_components/OrganizationMembers";

export const metadata = {
  title: `IoTDataHub - Users | Dashboard `,
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} className="mx-1">
      <OrganizationMembers />
    </Stack>
  );
}
