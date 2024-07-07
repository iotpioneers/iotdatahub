"use client";

import React, { useEffect, useState } from "react";
import LineChartComponent from "../charts/LineChartComponent";
import AddChartComponent from "../charts/AddChartComponent";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";

interface Props {
  channelId: string;
}

interface ChannelData {
  channel: ChannelProps;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
}

const Stream = ({ channelId }: Props) => {
  const isSmallScreens = useMediaQuery("(max-width: 1060px)");
  const [channelData, setChannelData] = useState<ChannelData | null>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await fetch(
        `http://localhost:3000/api/channels/${channelId}`
      );
      const channelData: ChannelData = await res.json();

      console.log("channelData:--", channelData);

      setChannelData(channelData);
    };

    fetchChannel();
  }, [channelData]);

  if (!channelData) {
    return;
  }

  const { fields, dataPoint } = channelData;

  return (
    <div
      className={`grid ${isSmallScreens ? "grid-cols-1" : "grid-cols-2"} gap-4`}
    >
      {fields.map((field) => {
        const chartData = dataPoint.filter(
          (datapoint) => datapoint.fieldId === field.id
        );
        return (
          <div key={field.id}>
            <LineChartComponent chartData={chartData} />
          </div>
        );
      })}
      <AddChartComponent />
    </div>
  );
};

export default Stream;
