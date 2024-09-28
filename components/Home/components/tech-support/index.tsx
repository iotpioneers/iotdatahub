"use client";

import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { HelpOutline, Article, Message } from "@mui/icons-material";
import FAQ from "./FAQ";
import Resources from "./Resources";

import { faqItems, supportResources } from "./SupportData";

interface SearchItem {
  title: string;
  content: string;
  type: string;
}

const TechSupport: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<SearchItem | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1, mt: 12 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Technical Support Center
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="FAQ" icon={<HelpOutline />} />
            <Tab label="Resources" icon={<Article />} />
          </Tabs>
          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && <FAQ faqItems={faqItems} />}
            {tabValue === 1 && (
              <Resources supportResources={supportResources} />
            )}
          </Box>
        </Box>
      </Container>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedTopic?.title}</DialogTitle>
        <DialogContent>
          <Typography>{selectedTopic?.content}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TechSupport;
