"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import LoadingProgressBar from "@/components/LoadingProgressBar";

export function AccountInfo(): React.JSX.Element {
  const { status, data: session } = useSession();

  if (status === "loading") {
    return <LoadingProgressBar />;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <div>
            <Avatar
              src={session?.user?.image || "/user.svg"}
              sx={{ height: "80px", width: "80px" }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: "center" }}>
            <Typography variant="h5">{session!.user!.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              Kigali Rwanda
            </Typography>
            <Typography color="text.secondary" variant="body2">
              GTM-7
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
