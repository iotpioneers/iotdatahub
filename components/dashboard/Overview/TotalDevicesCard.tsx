import React, { useMemo } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// third-party
import PixOutlinedIcon from "@mui/icons-material/PixOutlined";

// project imports
import SkeletonTotalChannelDetailsCard from "../cards/Skeleton/SkeletonTotalChannelDetailsCard";

// assets
import Chart from "react-apexcharts";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MainCard from "../cards/MainCard";
import { Channel, Device, Field } from "@/types";

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

// const ChartDeviceData = {
//   type: "line" as "line",
//   height: 90,
//   options: {
//     chart: {
//       sparkline: {
//         enabled: true,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     colors: ["#fff"],
//     fill: {
//       type: "solid",
//       opacity: 1,
//     },
//     stroke: {
//       curve: "smooth" as "smooth",
//       width: 3,
//     },
//     yaxis: {
//       min: 0,
//       max: 100,
//     },
//     tooltip: {
//       theme: "dark",
//       fixed: {
//         enabled: false,
//       },
//       x: {
//         show: false,
//       },
//       y: {
//         title: {
//           formatter: () => "Total channels",
//         },
//       },
//       marker: {
//         show: false,
//       },
//     },
//   },
//   series: [
//     {
//       name: "series1",
//       data: [45, 66, 41, 89, 25, 44, 9, 54],
//     },
//   ],
// };
interface TotalDevicesCardProps {
  isLoading: boolean;
  devices: Device[] | null;
}

const TotalDevicesCard: React.FC<TotalDevicesCardProps> = ({
  isLoading,
  devices,
}) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!devices) return [];

    return devices.map((device, index) => ({
      x: index,
      y: device.status === "ONLINE" ? 1 : 0,
    }));
  }, [devices]);

  const ChartDeviceData = useMemo(
    () => ({
      type: "line" as const,
      height: 90,
      options: {
        chart: {
          sparkline: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#fff"],
        fill: {
          type: "solid",
          opacity: 1,
        },
        stroke: {
          curve: "smooth" as const,
          width: 3,
        },
        yaxis: {
          min: 0,
          max: 1,
        },
        tooltip: {
          theme: "dark",
          fixed: {
            enabled: false,
          },
          x: {
            show: false,
          },
          y: {
            title: {
              formatter: () => "Device Status",
            },
          },
          marker: {
            show: false,
          },
        },
      },
      series: [
        {
          name: "Device Status",
          data: chartData,
        },
      ],
    }),
    [chartData]
  );

  return (
    <>
      {isLoading ? (
        <SkeletonTotalChannelDetailsCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: "primary.dark",
            color: "#fff",
            overflow: "hidden",
            position: "relative",
            "&>div": {
              position: "relative",
              zIndex: 5,
            },
            "&:after": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
              borderRadius: "50%",
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 },
            },
            "&:before": {
              content: '""',
              position: "absolute",
              width: 210,
              height: 210,
              background: theme.palette.primary[800],
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
                        bgcolor: "primary.800",
                        color: "#fff",
                        mt: 1,
                      }}
                    >
                      <PixOutlinedIcon fontSize="inherit" />
                    </Avatar>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
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
                          {devices ? devices.length : 0}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Avatar
                          sx={{
                            ...theme.typography.smallAvatar,
                            cursor: "pointer",
                            bgcolor: "primary.200",
                            color: "primary.dark",
                          }}
                        >
                          <ArrowDownwardIcon
                            fontSize="inherit"
                            sx={{ transform: "rotate3d(1, 1, 1, 45deg)" }}
                          />
                        </Avatar>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: "1rem",
                            fontWeight: 500,
                            color: "primary.200",
                          }}
                        >
                          Total Devices
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Chart {...ChartDeviceData} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default TotalDevicesCard;
