import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getDaysInMonth(month: number, year: number) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

export default function IoTActivityChart() {
  const theme = useTheme();
  const data = getDaysInMonth(4, 2024);

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Activities
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              25,732
            </Typography>
            <Chip size="small" color="success" label="+42%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total activity in the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
            },
          ]}
          series={[
            {
              id: "devicesConnected",
              label: "Devices Connected",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                500, 1000, 800, 1600, 2000, 2400, 3000, 2700, 3300, 3600, 2200,
                4000, 4400, 4700, 5100, 5500, 4900, 6000, 6400, 6800, 6200,
                7200, 7600, 8000, 8400, 8800, 9200, 9600, 10000, 10400,
              ],
            },
            {
              id: "messagesSent",
              label: "Messages Sent",
              showMark: false,
              curve: "linear",
              stack: "total",
              area: true,
              stackOrder: "ascending",
              data: [
                700, 1200, 1000, 1800, 1400, 2100, 2800, 2400, 3100, 3400, 2800,
                3900, 4300, 4600, 5000, 5400, 3500, 5800, 6200, 6600, 7000,
                7400, 7800, 8200, 7000, 8600, 9000, 9400, 9800, 10200,
              ],
            },
            {
              id: "sensorReadings",
              label: "Sensor Readings",
              showMark: false,
              curve: "linear",
              stack: "total",
              stackOrder: "ascending",
              data: [
                1500, 2000, 1700, 2200, 1800, 2500, 3000, 2700, 3200, 3400,
                3000, 3600, 4000, 4400, 3900, 4500, 4700, 4100, 4900, 5100,
                4600, 5300, 5700, 5900, 5500, 6100, 6500, 6900, 7300, 7700,
              ],
              area: true,
            },
          ]}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={{
            "& .MuiAreaElement-series-sensorReadings": {
              fill: "url('#sensorReadings')",
            },
            "& .MuiAreaElement-series-messagesSent": {
              fill: "url('#messagesSent')",
            },
            "& .MuiAreaElement-series-devicesConnected": {
              fill: "url('#devicesConnected')",
            },
          }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient
            color={theme.palette.primary.dark}
            id="sensorReadings"
          />
          <AreaGradient color={theme.palette.primary.main} id="messagesSent" />
          <AreaGradient
            color={theme.palette.primary.light}
            id="devicesConnected"
          />
        </LineChart>
      </CardContent>
    </Card>
  );
}
