"use client";

import React, { useState } from "react";

// material-ui
import { Grid, MenuItem, TextField, Typography } from "@mui/material";

// project imports
import { gridSpacing } from "./constant";
import LineChartComponent from "../charts/LineChartComponent";
import MainCard from "@/components/dashboard/cards/MainCard";
import { Channel, DataPoint, Field } from "@/types";
import BarChartWidget from "../charts/BarChartWidget";
import { AddChartComponent } from "../charts";
import GaugeWidget from "../charts/GaugeWidget";

const status = [
  {
    value: "today",
    label: "Today",
  },
  {
    value: "month",
    label: "This Month",
  },
  {
    value: "year",
    label: "This Year",
  },
];

const widgets = [
  {
    value: "lineChart",
    label: "Line Chart",
  },
  {
    value: "barChart",
    label: "Bar Chart",
  },
  {
    value: "gauge",
    label: "Gauge",
  },
];

interface Props {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
}

const ChannelDataStream = ({ channel, fields, dataPoint }: Props) => {
  const [value, setValue] = useState("today");
  const [widget, setWidget] = useState("lineChart");

  const renderChart = (chartData: DataPoint[]) => {
    switch (widget) {
      case "lineChart":
        return <LineChartComponent chartData={chartData} />;
      case "barChart":
        return <BarChartWidget chartData={chartData} />;
      case "gauge":
        return <GaugeWidget chartData={chartData} />;

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {fields.map((field) => {
        const chartData = dataPoint.filter(
          (datapoint) => datapoint.fieldId === field.id
        );
        return (
          <div key={field.id}>
            <MainCard border={true}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography variant="h3">{field.name}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <TextField
                        id="standard-select-currency"
                        select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      >
                        {status.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {renderChart(chartData)}
                </Grid>
              </Grid>
            </MainCard>
          </div>
        );
      })}
      <MainCard border={true}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="h3">Choose widget</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <TextField
                  id="standard-select-currency"
                  select
                  value={widget}
                  onChange={(e) => setWidget(e.target.value)}
                >
                  {widgets.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className="flex justify-center items-center">
            <AddChartComponent channel={channel} />
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
};

export default ChannelDataStream;
