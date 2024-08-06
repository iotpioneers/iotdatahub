import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";

import OrganizationMembers from "./_components/OrganizationMembers";

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3} className="mx-1">
      <OrganizationMembers />
    </Stack>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Organization - IoTDataHub - Dashboard",
  description:
    "View all project users and permissions and control options for each user in your organization",
};
