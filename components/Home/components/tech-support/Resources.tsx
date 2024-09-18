import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";

interface ResourceItem {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface ResourcesProps {
  supportResources: ResourceItem[];
}

const Resources: React.FC<ResourcesProps> = ({ supportResources }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Support Resources
      </Typography>
      <Grid container spacing={2}>
        {supportResources.map((resource, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {resource.icon}
                  <Typography variant="h6" ml={1}>
                    {resource.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Access our {resource.title.toLowerCase()} for in-depth
                  information and guides.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href={resource.link}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Resources;
