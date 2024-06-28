"use client";

import React, { useEffect, useState } from "react";
import LineChartComponent from "../charts/LineChartComponent";
import AddChartComponent from "../charts/AddChartComponent";
import useMediaQuery from "@/hooks/useMediaQuery";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import { Text } from "@radix-ui/themes";
import Loading from "@/app/loading";

// this will be receiving an object where the object will be containing the data and the type of chart we should load for it, the we shall use the switch case to render the correct chart
// the also will be passed to the component as an array of object

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
  const [channelDetails, setChannelDetails] = useState<ChannelData | null>(
    null
  );

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await fetch(
        `http://localhost:3000/api/channels/${channelId}`
      );
      const channelData: ChannelData = await res.json();

      console.log("channelData:--", channelData);

      setChannelDetails(channelData);
    };

    fetchChannel();
  }, [channelDetails]);

  if (!channelDetails) {
    return <Loading />;
  }

  const { fields, dataPoint } = channelDetails;

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
