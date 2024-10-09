"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import {
  DeviceThermostat,
  ElectricalServices,
  Router,
} from "@mui/icons-material";

// Dynamic import for GaugeComponent
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

// TypeScript interfaces
interface ChartDataPoint {
  id: number;
  value: number;
  timestamp: string;
}

interface GaugeWidgetProps {
  chartData: ChartDataPoint[];
  title: string;
  unit: string;
  minValue: number;
  maxValue: number;
}

interface TimeSeriesDataPoint {
  time: Date;
  value: number;
  value2: number;
  [key: string]: any;
}

interface PieDataPoint {
  id: number;
  value: number;
  label: string;
  [key: string]: any;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Constants for animations

// TabPanel Component
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// Data generation functions
const generateSensorData = (
  points: number = 20,
  min: number,
  max: number
): ChartDataPoint[] => {
  return Array.from({ length: points }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * (max - min)) + min,
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
};

const generateEnergyData = (points: number = 20): TimeSeriesDataPoint[] => {
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - i * 3600000),
    value: Math.floor(Math.random() * 1000) + 500, // Power consumption (watts)
    value2: Math.floor(Math.random() * 500) + 200, // Solar generation (watts)
  }));
};

const generateNetworkStats = (): PieDataPoint[] => {
  return [
    {
      id: 1,
      value: Math.floor(Math.random() * 40) + 30,
      label: "MQTT Messages",
    },
    {
      id: 2,
      value: Math.floor(Math.random() * 30) + 20,
      label: "HTTP Requests",
    },
    {
      id: 3,
      value: Math.floor(Math.random() * 20) + 10,
      label: "CoAP Messages",
    },
    { id: 4, value: Math.floor(Math.random() * 15) + 5, label: "WebSocket" },
  ];
};

// Chart Components
const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  chartData,
  title,
  unit,
  minValue,
  maxValue,
}) => {
  const [currentValue, setCurrentValue] = useState(
    chartData[0]?.value || minValue
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentValue(
        Math.floor(Math.random() * (maxValue - minValue)) + minValue
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [maxValue, minValue]);

  // Calculate the range and segment sizes
  const range = maxValue - minValue;
  const segment1 = minValue + range * 0.33;
  const segment2 = minValue + range * 0.66;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title} ({unit})
        </Typography>
        <GaugeComponent
          id={`gauge-${title}`}
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            cornerRadius: 1,
            colorArray: ["#5BE12C", "#F5CD19", "#EA4228"],
            subArcs: [
              { limit: segment1 },
              { limit: segment2 },
              { limit: maxValue },
            ],
          }}
          pointer={{
            type: "needle",
            color: "#345243",
            length: 0.8,
            width: 15,
          }}
          value={currentValue}
          minValue={minValue}
          maxValue={maxValue}
        />
      </CardContent>
    </Card>
  );
};

const EnergyConsumptionChart: React.FC = () => {
  const [data, setData] = useState<TimeSeriesDataPoint[]>(generateEnergyData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateEnergyData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Energy Consumption vs. Generation
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <LineChart
            dataset={data}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
            xAxis={[
              {
                dataKey: "time",
                scaleType: "time",
                valueFormatter: (value: Date) => value.toLocaleTimeString(),
              },
            ]}
            series={[
              { dataKey: "value", label: "Consumption (W)" },
              { dataKey: "value2", label: "Solar Generation (W)" },
            ]}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const DeviceStatusChart: React.FC = () => {
  const [data, setData] = useState<PieDataPoint[]>(generateNetworkStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateNetworkStats());
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Protocol Distribution
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <PieChart
            series={[
              {
                data,
                innerRadius: 30,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const HomeAnimatedMovingFeaturesComponent: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "text.primary", mb: 4 }}
      >
        IoT Device Analytics Dashboard
      </Typography>

      <Paper sx={{ width: "100%", mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dashboard tabs"
        >
          <Tab icon={<DeviceThermostat />} label="Environmental Sensors" />
          <Tab icon={<ElectricalServices />} label="Energy Monitoring" />
          <Tab icon={<Router />} label="Network Analytics" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <GaugeWidget
              chartData={generateSensorData(20, -10, 50)}
              title="Temperature"
              unit="°C"
              minValue={-10}
              maxValue={50}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <GaugeWidget
              chartData={generateSensorData(20, 0, 100)}
              title="Humidity"
              unit="%"
              minValue={0}
              maxValue={100}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <GaugeWidget
              chartData={generateSensorData(20, 900, 1100)}
              title="Air Pressure"
              unit="hPa"
              minValue={900}
              maxValue={1100}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <EnergyConsumptionChart />
          </Grid>
          <Grid item xs={12} lg={4}>
            <GaugeWidget
              chartData={generateSensorData(20, 0, 2000)}
              title="Current Power"
              unit="W"
              minValue={0}
              maxValue={2000}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DeviceStatusChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Network Performance
                </Typography>
                <Box sx={{ width: "100%", height: 300 }}>
                  <BarChart
                    dataset={[
                      {
                        category: "Latency",
                        value: Math.random() * 100,
                        color: "red",
                      },
                      {
                        category: "Packet Loss",
                        value: Math.random() * 5,
                        color: "green",
                      },
                      {
                        category: "Signal Strength",
                        value: Math.random() * 100,
                        color: "orange",
                      },
                    ]}
                    xAxis={[{ scaleType: "band", dataKey: "category" }]}
                    series={[{ dataKey: "value" }]}
                    height={300}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default HomeAnimatedMovingFeaturesComponent;
