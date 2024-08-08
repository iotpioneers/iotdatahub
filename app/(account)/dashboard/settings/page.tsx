import * as React from "react";
import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Notifications } from "../../../../components/Dashboard/settings/notifications";
import { UpdatePasswordForm } from "../../../../components/Dashboard/settings/update-password-form";

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Settings</Typography>
      </div>
      <Notifications />
      <UpdatePasswordForm />
    </Stack>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings - IoTDataHub - Dashboard",
  description:
    "View and manage your account details, including notifications and password",
};
