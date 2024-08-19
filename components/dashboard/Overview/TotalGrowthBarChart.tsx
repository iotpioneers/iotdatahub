import PropTypes from "prop-types";
import React from "react";

// material-ui
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// third-party
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

// project imports
import SkeletonTotalGrowthBarChart from "../cards/Skeleton/SkeletonTotalGrowthBarChart";
import MainCard from "../cards/MainCard";
import { gridSpacing } from "@/app/store/constant";
import { Channel, Field, DataPoint } from "@/types";

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const dataLine = [
  { name: "Jan", value: 50 },
  { name: "Feb", value: 80 },
  { name: "Mar", value: 30 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 90 },
  { name: "Jul", value: 100 },
];

interface TotalGrowthBarChartProps {
  isLoading: boolean;
  channels: Channel[] | null;
  fields: Field[] | null;
  dataPoints: DataPoint[] | null;
}

const TotalGrowthBarChart = ({
  isLoading,
  channels,
  fields,
  dataPoints,
}: TotalGrowthBarChartProps) => {
  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                marginBottom={3}
              >
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="h2">
                        Data Condition Overview
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                "& .apexcharts-menu.apexcharts-menu-open": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  width={730}
                  height={250}
                  data={dataLine}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalGrowthBarChart;
