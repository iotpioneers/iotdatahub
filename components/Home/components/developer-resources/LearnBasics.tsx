import React from "react";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

// Learn basics card component
interface LearnBasicsCardProps {
  title: string;
  description: string;
}

const LearnBasicsCard: React.FC<LearnBasicsCardProps> = ({
  title,
  description,
}) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </CardContent>
      <Button size="small" sx={{ m: 2 }}>
        Learn more
      </Button>
    </Card>
  );
};

// Learn basics section
const LearnBasics: React.FC = () => {
  const basics = [
    {
      title: "What is Virtual Pin",
      description:
        "Understand the concept of Virtual Pins for data exchange between hardware, cloud, and smartphone.",
    },
    {
      title: "Setting up Datastreams",
      description:
        "Learn how to configure Datastreams for efficient data flow in your IoT projects.",
    },
    {
      title: "Device Provisioning",
      description:
        "Simplify device onboarding and automate firmware configuration for seamless user experiences.",
    },
    {
      title: "Over-the-Air Updates",
      description:
        "Discover how to manage firmware updates for individual devices or scaled deployments.",
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Learn IoTDataHub Basics
      </Typography>
      <Grid container spacing={4}>
        {basics.map((basic, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <LearnBasicsCard {...basic} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LearnBasics;
