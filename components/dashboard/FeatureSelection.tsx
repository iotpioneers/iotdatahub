"use client";

import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

interface FeatureSelectionProps {
  onSubmit: (features: string[]) => void;
}

const FeatureSelection: React.FC<FeatureSelectionProps> = ({ onSubmit }) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prevSelectedFeatures) =>
      prevSelectedFeatures.includes(feature)
        ? prevSelectedFeatures.filter((f) => f !== feature)
        : [...prevSelectedFeatures, feature]
    );
  };

  const userFeatures = ["Feature A", "Feature B", "Feature C"];
  const enterpriseFeatures = ["Feature X", "Feature Y", "Feature Z"];

  const handleSubmit = () => {
    onSubmit(selectedFeatures);
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Choose your desired features
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            User Features
          </Typography>
          {userFeatures.map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
              }
              label={feature}
            />
          ))}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom>
            Enterprise Features
          </Typography>
          {enterpriseFeatures.map((feature) => (
            <FormControlLabel
              key={feature}
              control={
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
              }
              label={feature}
            />
          ))}
        </Grid>
      </Grid>
      <Button variant="contained" onClick={handleSubmit}>
        Submit Features
      </Button>
    </div>
  );
};

export default FeatureSelection;
