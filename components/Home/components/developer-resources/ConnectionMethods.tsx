"use client";

import React from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import {
  CloudQueue as CloudIcon,
  DeviceHub as DeviceIcon,
  WifiTethering as ConnectivityIcon,
} from "@mui/icons-material";

// Connection method card component
interface ConnectionMethodProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ConnectionMethodCard: React.FC<ConnectionMethodProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {icon}
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <Button size="small" sx={{ m: 2 }}>
        Learn More
      </Button>
    </Card>
  );
};

// Connection methods section
const ConnectionMethods: React.FC = () => {
  const connectionMethods = [
    {
      title: "IoTDataHub.Connect",
      description:
        "Our recommended method for cloud connection, data exchange, and OTA updates.",
      icon: <CloudIcon fontSize="large" color="primary" />,
    },
    {
      title: "MQTT API",
      description:
        "Ideal for projects using MQTT libraries, Node-RED, or MQTT-enabled hardware.",
      icon: <DeviceIcon fontSize="large" color="primary" />,
    },
    {
      title: "HTTP API",
      description: "RESTful API for easy data exchange using HTTP requests.",
      icon: <ConnectivityIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Pick your way to connect to IoTDataHub
      </Typography>
      <Grid container spacing={4}>
        {connectionMethods.map((method, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <ConnectionMethodCard {...method} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ConnectionMethods;
