"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchItem {
  title: string;
  content: string;
  type: string;
}

interface SearchProps {
  allContent: SearchItem[];
  onItemClick: (item: SearchItem) => void;
}

const Search: React.FC<SearchProps> = ({ allContent, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredContent, setFilteredContent] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      setFilteredContent([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulating an API call for search
    setTimeout(() => {
      const results = allContent.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContent(results);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for help..."
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Search Results
          </Typography>
          {isLoading ? (
            <CircularProgress />
          ) : filteredContent.length > 0 ? (
            <List>
              {filteredContent.map((item, index) => (
                <ListItem key={index} button onClick={() => onItemClick(item)}>
                  <ListItemText
                    primary={item.title}
                    secondary={item.content.substring(0, 100) + "..."}
                  />
                  <Chip label={item.type} color="primary" variant="outlined" />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>
              No results found. Try a different search term.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
