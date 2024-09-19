"use client";

import React from "react";
import {
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Code as CodeIcon } from "@mui/icons-material";

// Technical requirements section
const TechnicalRequirements: React.FC = () => {
  const requirements = [
    {
      title: "IoT Hardware",
      items: [
        "ESP32, ESP8266",
        "Arduino (any model)",
        "Raspberry Pi (any model)",
        "And 400+ more",
      ],
    },
    {
      title: "Smartphone",
      items: ["Android OS version 5+", "iOS version 14.1+"],
    },
    {
      title: "Desktop Device",
      items: ["Windows", "MacOS", "Linux"],
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Technical Requirements
      </Typography>
      <Grid container spacing={4}>
        {requirements.map((req, index) => (
          <Grid item key={index} xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" component="h3" gutterBottom>
                {req.title}
              </Typography>
              <List dense>
                {req.items.map((item, itemIndex) => (
                  <ListItem key={itemIndex}>
                    <ListItemIcon>
                      <CodeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TechnicalRequirements;
