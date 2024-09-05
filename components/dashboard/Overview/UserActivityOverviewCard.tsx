import React, { useState, useMemo } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import MainCard from "../cards/MainCard";
import SkeletonUserActivityOverviewCard from "../cards/Skeleton/SkeletonUserActivityOverviewCard";
import { gridSpacing } from "@/app/store/constant";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { Channel, DataPoint, Device, Field } from "@/types";

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

  const calculateChange = (
    currentCount: number,
    previousCount: number
  ): number => {
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    return ((currentCount - previousCount) / previousCount) * 100;
  };

  const activityData = useMemo(() => {
    if (!dataPoints || !fields) return null;

    const getDataForPeriod = (period: Period) => {
      const filteredData = filterDataByPeriod(dataPoints, period);
      const result: Record<string, number> = {};

      fields.forEach((field) => {
        result[field.name] = filteredData.filter(
          (point) => point.fieldId === field.id
        ).length;
      });

      return result;
    };

    const currentData = getDataForPeriod(selectedPeriod);
    const previousPeriod: Period =
      selectedPeriod === "last30days"
        ? "last60days"
        : selectedPeriod === "last60days"
        ? "last90days"
        : "last90days";
    const previousData = getDataForPeriod(previousPeriod);

    const changes: Record<string, number> = {};
    Object.keys(currentData).forEach((key) => {
      changes[key] = calculateChange(currentData[key], previousData[key]);
    });

    return { currentData, changes };
  }, [dataPoints, fields, selectedPeriod]);

  const renderActivityItem = (label: string, count: number, change: number) => (
    <Grid container direction="column" key={label}>
      <Grid item>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle1" color="inherit">
              {label}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  {count}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "5px",
                    bgcolor: change >= 0 ? "success.light" : "orange.light",
                    color: change >= 0 ? "success.dark" : "orange.dark",
                    ml: 2,
                  }}
                >
                  {change >= 0 ? (
                    <KeyboardArrowUpOutlinedIcon
                      fontSize="small"
                      color="inherit"
                    />
                  ) : (
                    <KeyboardArrowDownOutlinedIcon
                      fontSize="small"
                      color="inherit"
                    />
                  )}
                </Avatar>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography
          variant="subtitle2"
          sx={{ color: change >= 0 ? "success.dark" : "orange.dark" }}
        >
          {Math.abs(change).toFixed(2)}% {change >= 0 ? "Increase" : "Decrease"}{" "}
          from previous period
        </Typography>
      </Grid>
    </Grid>
  );

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
                  <>
                    {Object.entries(activityData.currentData).map(
                      ([key, value], index) => (
                        <React.Fragment key={key}>
                          {renderActivityItem(
                            key,
                            value,
                            activityData.changes[key]
                          )}
                          {index <
                            Object.entries(activityData.currentData).length -
                              1 && <Divider sx={{ my: 1.5 }} />}
                        </React.Fragment>
                      )
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ p: 1.25, pt: 0, justifyContent: "center" }}>
            <Button size="small" disableElevation>
              View All
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

export default UserActivityOverviewCard;
