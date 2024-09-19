"use client";

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
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
import Search from "./Search";
import FAQ from "./FAQ";
import Resources from "./Resources";
import ContactForm from "./ContactForm";

import {
  faqItems,
  supportResources,
  troubleshootingGuide,
} from "./SupportData";

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

  const handleOpenDialog = (topic: SearchItem) => {
    setSelectedTopic(topic);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const allContent: SearchItem[] = [
    ...faqItems.map((item) => ({
      title: item.question,
      content: item.answer,
      type: "FAQ",
    })),
    ...supportResources.map((item) => ({
      title: item.title,
      content: `Resource for ${item.title}`,
      type: "Resource",
      link: item.link,
    })),
    ...troubleshootingGuide.map((item) => ({
      title: item.title,
      content: item.content,
      type: "Troubleshooting",
    })),
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 12 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Technical Support Center
        </Typography>
        <Search allContent={allContent} onItemClick={handleOpenDialog} />
        <Box sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="FAQ" icon={<HelpOutline />} />
            <Tab label="Resources" icon={<Article />} />
            <Tab label="Contact" icon={<Message />} />
          </Tabs>
          <Box sx={{ mt: 3 }}>
            {tabValue === 0 && <FAQ faqItems={faqItems} />}
            {tabValue === 1 && (
              <Resources supportResources={supportResources} />
            )}
            {tabValue === 2 && <ContactForm />}
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
