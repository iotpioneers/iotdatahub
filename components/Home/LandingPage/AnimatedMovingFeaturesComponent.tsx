"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "react-spring";
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Modal,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PieChart } from "@mui/x-charts";

import {
  DevicesOther,
  Speed,
  Opacity,
  WbSunny,
  Thermostat,
  Battery20,
  BatteryFull,
} from "@mui/icons-material";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

interface ChartDataPoint {
  id: number;
  value: number;
  timestamp: string;
}

interface GaugeWidgetProps {
  chartData: ChartDataPoint[];
}

interface GridDataItem {
  id: number;
  deviceName: string;
  status: string;
  lastReading: number;
  batteryLevel: number;
}

// Generate random data for charts
const generateChartData = (points: number = 20): ChartDataPoint[] => {
  return Array.from({ length: points }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * 100),
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
  }));
};

// Generate random data for DataGrid
const generateGridData = (rows: number = 10): GridDataItem[] => {
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    deviceName: `Device ${i + 1}`,
    status: Math.random() > 0.5 ? "Online" : "Offline",
    lastReading: Math.floor(Math.random() * 100),
    batteryLevel: Math.floor(Math.random() * 100),
  }));
};

const GaugeWidget: React.FC<GaugeWidgetProps> = ({ chartData = [] }) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredTimestamp, setHoveredTimestamp] = useState<string | null>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);

  const latestDataPoint =
    chartData.length > 0 ? chartData[chartData.length - 1] : null;
  const currentValue = latestDataPoint ? latestDataPoint.value : 0;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!gaugeRef.current || chartData.length === 0) return;

    const rect = gaugeRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const angle =
      Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    const normalizedAngle = (angle + 360) % 360;
    const mappedValue = (normalizedAngle + 90) * (100 / 270);

    const closestDataPoint = chartData.reduce((prev, curr) => {
      return Math.abs(curr.value - mappedValue) <
        Math.abs(prev.value - mappedValue)
        ? curr
        : prev;
    });

    setHoveredValue(closestDataPoint.value);
    setHoveredTimestamp(closestDataPoint.timestamp);
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
    setHoveredTimestamp(null);
  };

  return (
    <div
      ref={gaugeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <GaugeComponent
        id="gauge-component"
        type="semicircle"
        arc={{
          width: 0.2,
          padding: 0.005,
          cornerRadius: 1,
          colorArray: ["#5BE12C", "#F5CD19", "#EA4228"],
          subArcs: [{ limit: 33 }, { limit: 66 }, { limit: 100 }],
        }}
        pointer={{
          type: "needle",
          color: "#345243",
          length: 0.8,
          width: 15,
        }}
        value={currentValue}
        minValue={0}
        maxValue={100}
      />
      {hoveredValue !== null && hoveredTimestamp !== null && (
        <div className="text-orange-50">
          Value: {hoveredValue}
          <br />
          Timestamp: {hoveredTimestamp}
        </div>
      )}
    </div>
  );
};

interface Feature {
  title: string;
  icon: JSX.Element;
  content: JSX.Element;
}

const features: Feature[] = [
  {
    title: "Device Management",
    icon: <DevicesOther />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom className="text-orange-50">
          Devices Overview
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid<GridDataItem>
            rows={generateGridData(15)}
            columns={[
              { field: "deviceName", headerName: "Device Name", flex: 1 },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                renderCell: (params) => (
                  <Box
                    sx={{
                      color:
                        params.value === "Online"
                          ? "success.main"
                          : "error.main",
                    }}
                    className="text-orange-50"
                  >
                    {params.value}
                  </Box>
                ),
              },
              {
                field: "lastReading",
                headerName: "Last Reading",
                flex: 1,
                renderCell: (params) => (
                  <span className="text-orange-50">{`${params.value} units`}</span>
                ),
              },
              {
                field: "batteryLevel",
                headerName: "Battery",
                flex: 1,
                renderCell: (params) => (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {params.value < 20 ? (
                      <Battery20 color="error" />
                    ) : (
                      <BatteryFull color="success" />
                    )}
                    <LinearProgress
                      variant="determinate"
                      value={params.value}
                      sx={{ flexGrow: 1, ml: 1 }}
                    />
                  </Box>
                ),
              },
            ]}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            autoHeight
            disableRowSelectionOnClick
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      </Box>
    ),
  },
  {
    title: "Real-time Monitoring",
    icon: <Speed color="warning" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom className="text-orange-50">
          Sensor Readings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" className="text-orange-50">
                  Temperature
                </Typography>
                <GaugeWidget chartData={generateChartData()} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" className="text-orange-50">
                  Humidity
                </Typography>
                <GaugeWidget chartData={generateChartData()} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    ),
  },
  {
    title: "Environmental Monitoring",
    icon: <Opacity color="warning" />,
    content: (
      <Box>
        <Typography variant="h6" gutterBottom className="text-orange-50">
          Environmental Conditions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "CO2" },
                    { id: 1, value: 15, label: "O2" },
                    { id: 2, value: 20, label: "N2" },
                  ],
                },
              ]}
              width={400}
              height={200}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <WbSunny />
                </ListItemIcon>
                <ListItemText
                  primary="Light Intensity"
                  secondary="500 lux"
                  className="text-orange-50"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Thermostat />
                </ListItemIcon>
                <ListItemText
                  primary="Temperature"
                  secondary="72°F"
                  className="text-orange-50"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Opacity />
                </ListItemIcon>
                <ListItemText
                  primary="Humidity"
                  secondary="45%"
                  className="text-orange-50"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>
    ),
  },
];

const AnimatedMovingFeaturesComponent: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollProps = useSpring({
    from: { transform: "translateY(100px)", opacity: 0 },
    to: { transform: "translateY(0px)", opacity: 1 },
    reset: true,
    reverse: currentFeature % 2 === 0,
  });

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "80vh", overflow: "hidden" }}>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {features[currentFeature].icon}
                    <Typography
                      variant="h5"
                      sx={{ ml: 1 }}
                      className="text-orange-50"
                    >
                      {features[currentFeature].title}
                    </Typography>
                  </Box>
                  <animated.div style={scrollProps}>
                    {features[currentFeature].content}
                  </animated.div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "80vh", overflow: "auto" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom className="text-orange-50">
                Quick Stats
              </Typography>
              {features.map((feature, index) => (
                <Button
                  key={index}
                  fullWidth
                  variant={currentFeature === index ? "contained" : "outlined"}
                  sx={{ mb: 1 }}
                  onClick={() => setCurrentFeature(index)}
                >
                  <span className="text-orange-50">{feature.title}</span>
                </Button>
              ))}
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2 }}
              >
                <span className="text-orange-50">Show Details</span>
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            className="text-orange-50"
          >
            Detailed Information
          </Typography>
          <Typography
            id="modal-description"
            sx={{ mt: 2 }}
            className="text-orange-50"
          >
            This modal can be used to display more detailed information or
            controls for the selected feature.
          </Typography>
          <Button onClick={() => setModalOpen(false)} sx={{ mt: 2 }}>
            <span className="text-orange-50">Close</span>
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AnimatedMovingFeaturesComponent;
