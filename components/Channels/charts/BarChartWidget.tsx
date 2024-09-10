import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

interface DataPointProps {
  id: string;
  timestamp: string;
  value: number;
}

interface BarChartWidgetProps {
  chartData?: DataPointProps[];
}

const chartSetting = {
  series: [{ dataKey: "value" }],
  height: 300,
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: "translateX(-10px)",
    },
  },
};

const BarChartWidget = ({ chartData = [] }: BarChartWidgetProps) => {
  let data = [];

  data = chartData.map((dataPoint) => {
    const formatDate = (date: string) =>
      new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(new Date(date));

    return {
      key: dataPoint.id,
      timestamp: formatDate(dataPoint.timestamp),
      value: dataPoint.value,
    };
  });

  if (data.length === 0) {
    data = [
      {
        key: "1",
        timestamp: new Date().toDateString(),
        value: 0,
      },
    ];
  }

  return (
    <div style={{ width: "100%" }}>
      <BarChart
        dataset={data}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "timestamp",
            tickPlacement: "middle",
            tickLabelPlacement: "middle",
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
};

export default BarChartWidget;
