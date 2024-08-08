import { Metadata } from "next";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { AccountDetailsForm } from "@/components/dashboard/account/AccountDetailsForm";
import { AccountInfo } from "@/components/dashboard/account/AccountInfo";

export default function AccountPage(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account - IoTDataHub - Dashboard",
  description: "Manage your account details",
};
