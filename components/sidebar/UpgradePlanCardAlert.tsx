"use client";

import { memo, useState, useEffect } from "react";
import axios from "axios";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import AnimateButton from "@/components/Auth/AnimateButton";
import { Link } from "@mui/material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

// assets
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { useSession } from "next-auth/react";
import { UserSubscriptionData } from "@/types";

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(new Date(date));

const LinearProgressWithLabel = ({
  value,
  remainingDays,
  ...others
}: {
  value: number;
  remainingDays: number | null;
}) => {
  const getProgressBarColor = () => {
    if (remainingDays !== null && remainingDays <= 10) {
      return "warning";
    } else if (value >= 80) {
      return "error";
    } else {
      return "primary";
    }
  };

  return (
    <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ color: "primary.800" }}>
              Usage
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="inherit">
              {`${Math.round(value)}%`} of limit
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <LinearProgress
          aria-label="progress of theme"
          variant="determinate"
          value={value}
          color={getProgressBarColor()}
          {...others}
          sx={{
            height: 10,
            borderRadius: 30,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              bgcolor: "background.paper",
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              bgcolor: "primary.dark",
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

const UpgradePlanCardAlert = () => {
  const theme = useTheme();
  const { status, data: session } = useSession();
  const [subscription, setSubscription] = useState<UserSubscriptionData | null>(
    null
  );

  useEffect(() => {
    const fetchSubscription = async () => {
      if (status !== "loading" && status === "authenticated") {
        try {
          const res = await axios.get(
            process.env.NEXT_PUBLIC_BASE_URL +
              `/api/pricing/current/${session.user.subscriptionId}`
          );
          setSubscription(res.data);
        } catch (error) {
          console.error("Error fetching subscription data:", error);
        }
      }
    };

    fetchSubscription();
  }, [status, session?.user.subscriptionId]);

  // Calculate the remaining days before subscription expiration
  const currentPeriodStart = subscription?.currentPeriodStart
    ? new Date(subscription.currentPeriodStart).getTime()
    : null;
  const currentPeriodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).getTime()
    : null;

  const remainingDays =
    currentPeriodStart !== null && currentPeriodEnd !== null
      ? Math.floor(
          (currentPeriodEnd - currentPeriodStart) / (1000 * 60 * 60 * 24)
        )
      : null;

  const usagePercentage =
    remainingDays !== null &&
    currentPeriodStart !== null &&
    currentPeriodEnd !== null
      ? Math.round(
          ((currentPeriodEnd - Date.now()) /
            (currentPeriodEnd - currentPeriodStart)) *
            100
        )
      : 0;

  if ((status !== "loading" && status === "unauthenticated") || !subscription) {
    return null;
  }

  return (
    <Card
      sx={{
        bgcolor: "primary.light",
        mb: 2.75,
        overflow: "hidden",
        position: "relative",
        "&:after": {
          content: '""',
          position: "absolute",
          width: 157,
          height: 157,
          bgcolor: "primary.200",
          borderRadius: "50%",
          top: -105,
          right: -96,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List disablePadding sx={{ m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters disablePadding>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  color: "primary.main",
                  border: "none",
                  borderColor: "primary.main",
                  bgcolor: "background.paper",
                }}
              >
                <AutoAwesomeRoundedIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography variant="subtitle1" sx={{ color: "primary.800" }}>
                  {subscription.type}
                </Typography>
              }
              secondary={
                <Typography variant="caption">
                  Expires on {formatDate(subscription.currentPeriodEnd)}
                </Typography>
              }
            />
          </ListItem>
        </List>
        {subscription.type !== "Free" && (
          <LinearProgressWithLabel
            value={usagePercentage}
            remainingDays={remainingDays}
          />
        )}
        <Grid item sx={{ marginTop: 2 }}>
          <Stack direction="row">
            <Link
              sx={{ textDecoration: "none" }}
              href="/dashboard/subscription"
            >
              <AnimateButton>
                <Button
                  variant="contained"
                  color={
                    remainingDays !== null && remainingDays <= 10
                      ? "warning"
                      : "primary"
                  }
                  sx={{ boxShadow: "none" }}
                >
                  {subscription.type === "Free"
                    ? "Upgrade"
                    : remainingDays !== null && remainingDays <= 10
                    ? "Renew"
                    : "Manage"}
                </Button>
              </AnimateButton>
            </Link>
          </Stack>
        </Grid>
      </Box>
    </Card>
  );
};

export default memo(UpgradePlanCardAlert);
