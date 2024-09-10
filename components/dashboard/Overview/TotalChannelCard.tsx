import React from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import BroadcastOnPersonalOutlinedIcon from "@mui/icons-material/BroadcastOnPersonalOutlined";

// project imports
import { Channel } from "@/types";
import MainCard from "../cards/MainCard";
import SkeletonTotalChannelDetailsCard from "../cards/Skeleton/SkeletonTotalChannelDetailsCard";

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

interface TotalChannelCardProps {
  isLoading: boolean;
  channels: Channel[] | null;
}

const TotalChannelCard = ({ isLoading, channels }: TotalChannelCardProps) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalChannelDetailsCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: "secondary.dark",
            color: "#fff",
            overflow: "hidden",
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: "50%",
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.secondary[800],
              borderRadius: "50%",
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5,
            },
          }}
        >
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        bgcolor: "secondary.800",
                        mt: 1,
                      }}
                    >
                      <BroadcastOnPersonalOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: "2.125rem",
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                      }}
                    >
                      {channels ? channels.length : "No channel yet"}
                    </Typography>
                  </Grid>
                  {channels && channels.length > 0 && (
                    <Grid item>
                      <Avatar
                        sx={{
                          cursor: "pointer",
                          ...theme.typography.smallAvatar,
                          bgcolor: "secondary.200",
                          color: "secondary.dark",
                        }}
                      >
                        <ArrowUpwardIcon
                          fontSize="inherit"
                          sx={{ transform: "rotate3d(1, 1, 1, 45deg)" }}
                        />
                      </Avatar>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "secondary.200",
                  }}
                >
                  Total Channels
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default TotalChannelCard;
