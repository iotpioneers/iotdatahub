"use client";

import React, { useState, useMemo } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MainCard from "../cards/MainCard";
import SkeletonUserActivityOverviewCard from "../cards/Skeleton/SkeletonUserActivityOverviewCard";
import { gridSpacing } from "@/app/store/constant";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { Channel, DataPoint, Device, Field } from "@/types";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface UserActivityOverviewCardProps {
  isLoading: boolean;
  devices: Device[] | null;
  channels: Channel[] | null;
  fields: Field[] | null;
  dataPoints: DataPoint[] | null;
}

type Period = "last30days" | "last60days" | "last90days";

const UserActivityOverviewCard = ({
  isLoading,
  devices,
  channels,
  fields,
  dataPoints,
}: UserActivityOverviewCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | SVGSVGElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("last30days");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    handleClose();
  };

  const filterDataByPeriod = (
    data: DataPoint[],
    period: Period
  ): DataPoint[] => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "last30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "last60days":
        startDate.setDate(now.getDate() - 60);
        break;
      case "last90days":
        startDate.setDate(now.getDate() - 90);
        break;
    }

    return data.filter(
      (point) =>
        new Date(point.timestamp) >= startDate &&
        new Date(point.timestamp) <= now
    );
  };

  const activityData = useMemo(() => {
    if (!dataPoints || !fields) return null;

    const filteredData = filterDataByPeriod(dataPoints, selectedPeriod);
    const result: { id: string; value: number; label: string }[] = [];

    fields.forEach((field) => {
      const count = filteredData.filter(
        (point) => point.fieldId === field.id
      ).length;
      result.push({ id: field.name, value: count, label: field.name });
    });

    return result;
  }, [dataPoints, fields, selectedPeriod]);

  const getChartDimensions = () => {
    if (isMobile) {
      return { width: 300, height: 300 };
    } else if (isTablet) {
      return { width: 400, height: 400 };
    } else {
      return { width: 500, height: 500 };
    }
  };

  const { width, height } = getChartDimensions();

  const valueFormatter = (item: { value: number }) => `${item.value} points`;

  return (
    <>
      {isLoading ? (
        <SkeletonUserActivityOverviewCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Data Activity Overview</Typography>
                  </Grid>
                  <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: "primary.200",
                        cursor: "pointer",
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem
                        onClick={() => handlePeriodChange("last30days")}
                      >
                        Last 30 Days
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePeriodChange("last60days")}
                      >
                        Last 60 Days
                      </MenuItem>
                      <MenuItem
                        onClick={() => handlePeriodChange("last90days")}
                      >
                        Last 90 Days
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {activityData && (
                  <PieChart
                    series={[
                      {
                        data: activityData,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: { innerRadius: 30, additionalRadius: -30 },
                        valueFormatter,
                      },
                    ]}
                    height={height}
                    width={width}
                    slotProps={{
                      legend: {
                        direction: isMobile ? "column" : "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: 0,
                      },
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

export default UserActivityOverviewCard;
