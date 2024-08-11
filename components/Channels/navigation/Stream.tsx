"use client";

import React, { useState } from "react";

// material-ui
import { Grid, MenuItem, TextField, Typography } from "@mui/material";

// project imports
import { gridSpacing } from "./constant";
import LineChartComponent from "../charts/LineChartComponent";
import AddChartComponent from "../charts/AddChartComponent";
import { DataPointProps, FieldProps } from "@/types";
import MainCard from "@/components/dashboard/Header/cards/MainCard";

// types
import PropTypes from "prop-types";

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
    label: "Line Chart - Displays time-series data",
  },
  {
    value: "barChart",
    label: "Bar Chart - Compares different data points",
  },
  {
    value: "gauge",
    label: "Gauge - Shows real-time values",
  },
  {
    value: "numericDisplay",
    label: "Numeric Display - Shows current value readings",
  },
  {
    value: "map",
    label: "Map - Visualizes geographical data",
  },
  {
    value: "histogram",
    label: "Histogram - Analyzes data distribution",
  },
  {
    value: "pieChart",
    label: "Pie Chart - Displays parts of a whole",
  },
  {
    value: "scatterPlot",
    label: "Scatter Plot - Shows correlations between variables",
  },
  {
    value: "heatMap",
    label: "Heat Map - Visualizes data density",
  },
  {
    value: "table",
    label: "Table - Displays data in tabular format",
  },
];

interface Props {
  dataPoint: DataPointProps[];
  fields: FieldProps[];
}

const Stream = ({ fields, dataPoint }: Props) => {
  const [value, setValue] = useState("today");
  const [widget, setWidget] = useState("lineChart");

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
                  <LineChartComponent
                    chartData={chartData}
                    field={field.name}
                  />
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
            <AddChartComponent />
          </Grid>
        </Grid>
      </MainCard>
    </div>
  );
};

Stream.propTypes = {
  isLoading: PropTypes.bool,
};

export default Stream;
