"use client";

import React, { useState } from "react";
import { Grid, MenuItem, TextField, Typography } from "@mui/material";
import { gridSpacing } from "./constant";
import LineChartComponent from "../charts/LineChartComponent";
import MainCard from "@/components/dashboard/cards/MainCard";
import { Channel, DataPoint, Field } from "@/types";
import BarChartWidget from "../charts/BarChartWidget";
import { AddChartComponent } from "../charts";
import GaugeWidget from "../charts/GaugeWidget";

const widgets = [
  { value: "lineChart", label: "Line Chart" },
  { value: "barChart", label: "Bar Chart" },
  { value: "gauge", label: "Gauge" },
];

interface Props {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
}

const ChannelDataStream = ({ channel, fields, dataPoint }: Props) => {
  const [fieldWidgets, setFieldWidgets] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((field) => [field.id, "lineChart"]))
  );

  console.log("Data Points", dataPoint);

  const renderChart = (chartData: DataPoint[], widgetType: string) => {
    switch (widgetType) {
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

  const handleWidgetChange = (fieldId: string, newWidget: string) => {
    setFieldWidgets((prev) => ({ ...prev, [fieldId]: newWidget }));
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
                      <Typography variant="h3">{field.name}</Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        select
                        value={fieldWidgets[field.id]}
                        onChange={(e) =>
                          handleWidgetChange(field.id, e.target.value)
                        }
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
                <Grid item xs={12}>
                  {renderChart(chartData, fieldWidgets[field.id])}
                </Grid>
              </Grid>
            </MainCard>
          </div>
        );
      })}
      <MainCard border={true}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <Typography variant="h3">Add New Chart</Typography>
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
