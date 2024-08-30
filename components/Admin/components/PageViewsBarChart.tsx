import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@mui/material/styles";

export default function IoTDataBarChart() {
  const theme = useTheme();
  const colorPalette = [
    theme.palette.primary.dark,
    theme.palette.primary.main,
    theme.palette.primary.light,
  ];

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Device Activity Overview
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
              15.7K
            </Typography>
            <Chip size="small" color="success" label="+12%" />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total device interactions in the last 6 months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={
            [
              {
                scaleType: "band",
                categoryGapRatio: 0.5,
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
              },
            ] as any
          }
          series={[
            {
              id: "data-received",
              label: "Data Received",
              data: [4300, 4700, 5200, 4600, 5100, 4900, 5300],
              stack: "A",
            },
            {
              id: "commands-sent",
              label: "Commands Sent",
              data: [1200, 1500, 1300, 1600, 1400, 1500, 1700],
              stack: "A",
            },
            {
              id: "alerts-triggered",
              label: "Alerts Triggered",
              data: [350, 400, 380, 420, 390, 410, 450],
              stack: "A",
            },
          ]}
          height={250}
          margin={{ left: 50, right: 0, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
