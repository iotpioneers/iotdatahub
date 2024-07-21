"use client";

import React from "react";
import LineChartComponent from "../charts/LineChartComponent";
import AddChartComponent from "../charts/AddChartComponent";
import { DataPointProps, FieldProps } from "@/types";

interface Props {
  dataPoint: DataPointProps[];
  fields: FieldProps[];
}

const Stream = ({ fields, dataPoint }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {fields.map((field) => {
        const chartData = dataPoint.filter(
          (datapoint) => datapoint.fieldId === field.id
        );
        return (
          <div key={field.id}>
            <LineChartComponent chartData={chartData} field={field.name} />
          </div>
        );
      })}
      <AddChartComponent />
    </div>
  );
};

export default Stream;
