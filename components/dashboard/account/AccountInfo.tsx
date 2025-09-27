"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LoadingProgressBar from "@/components/loading-progress-bar";
import UploadImage from "@/components/dashboard/account/UploadImage";
import { useGlobalState } from "@/context/globalContext";

export function AccountInfo(): React.JSX.Element {
  const { state, updateUserData, isLoading } = useGlobalState();
  const { status, data: session } = useSession();

  const { currentUser } = state;

  if (
    (status !== "loading" && status === "unauthenticated") ||
    currentUser === null
  ) {
    redirect("/login");
  }

  const userName = currentUser?.name || session?.user?.name;
  const userEmail = currentUser?.email || session?.user?.email;
  const userImage = currentUser?.image || session?.user?.image;

  const handleImageUpload = async (imageUrl: string) => {
    if (currentUser) {
      const updatedUserData = {
        ...currentUser,
        image: imageUrl,
      };
      await updateUserData(updatedUserData);
    }
  };

  return (
    <Card>
      {isLoading && <LoadingProgressBar />}
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <div>
            <Avatar
              src={userImage || ""}
              sx={{
                height: "100px",
                width: "100px",
                border: "1px solid grey",
              }}
            />
          </div>
          <Stack spacing={1} sx={{ textAlign: "center" }}>
            <Typography variant="h5">{userName}</Typography>
            <Typography color="text.secondary" variant="body2">
              {userEmail}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          <UploadImage onUpload={handleImageUpload} />
        </Button>
      </CardActions>
    </Card>
  );
}
