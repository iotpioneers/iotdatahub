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
  LibraryBooks as DocsIcon,
  Forum as ForumIcon,
  GitHub as GitHubIcon,
  RssFeed as BlogIcon,
} from "@mui/icons-material";

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  description,
  icon,
  buttonText,
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
        {buttonText}
      </Button>
    </Card>
  );
};

// Helpful resources section
const HelpfulResources: React.FC = () => {
  const resources = [
    {
      title: "Documentation",
      description:
        "Complete documentation of all IoTDataHub features, commands, and instructions.",
      icon: <DocsIcon fontSize="large" color="primary" />,
      buttonText: "Read Docs",
    },
    {
      title: "Community",
      description:
        "Join our friendly forum to ask questions, share ideas, and discuss your projects.",
      icon: <ForumIcon fontSize="large" color="primary" />,
      buttonText: "Go to Forum",
    },
    {
      title: "GitHub",
      description:
        "Check our GitHub page for the latest hardware releases and examples.",
      icon: <GitHubIcon fontSize="large" color="primary" />,
      buttonText: "Open GitHub",
    },
    {
      title: "Blog",
      description:
        "Follow our blog for product updates, tutorials, and helpful industry news.",
      icon: <BlogIcon fontSize="large" color="primary" />,
      buttonText: "Open Blog",
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Helpful Resources
      </Typography>
      <Grid container spacing={4}>
        {resources.map((resource, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <ResourceCard {...resource} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HelpfulResources;
