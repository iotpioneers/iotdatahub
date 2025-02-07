import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import { Icon } from "@mui/material";
import { widgetDefinitions } from "./widgetDefinitions";
import type { WidgetType } from "@/types/widgets";

interface Props {
  onWidgetSelect: (type: WidgetType) => void;
}

const WidgetPalette: React.FC<Props> = ({ onWidgetSelect }) => {
  const categories = Array.from(
    new Set(widgetDefinitions.map((w) => w.category)),
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Widget Box
      </Typography>
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ textTransform: "capitalize", mb: 1 }}
          >
            {category}
          </Typography>
          <Grid container spacing={1}>
            {widgetDefinitions
              .filter((widget) => widget.category === category)
              .map((widget) => (
                <Grid item xs={6} key={widget.type}>
                  <Card
                    sx={{
                      cursor: "move",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onDoubleClick={() =>
                      onWidgetSelect(widget.type as WidgetType)
                    }
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify(widget),
                      );
                    }}
                  >
                    <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Icon sx={{ mr: 1 }}>{widget.icon}</Icon>
                        <Typography variant="body2">{widget.label}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default WidgetPalette;
