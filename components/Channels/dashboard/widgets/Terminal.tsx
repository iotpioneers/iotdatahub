"use client";

import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import type { WidgetSettings } from "@/types/widgets";

interface Props {
  settings: WidgetSettings;
  onChange: (settings: WidgetSettings) => void;
}

export const Terminal: React.FC<Props> = ({ settings, onChange }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const newOutput = [...(settings.output || []), input];
      onChange({ ...settings, output: newOutput });
      setInput("");
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          bgcolor: "black",
          color: "green",
          p: 1,
          fontFamily: "monospace",
          overflowY: "auto",
        }}
      >
        {settings.output?.map((line: string, i: number) => (
          <div key={i}>{line}</div>
        ))}
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleSubmit}
        sx={{
          mt: 1,
          "& .MuiOutlinedInput-root": {
            bgcolor: "black",
            color: "green",
            fontFamily: "monospace",
          },
        }}
        placeholder="Type here..."
      />
    </Box>
  );
};
