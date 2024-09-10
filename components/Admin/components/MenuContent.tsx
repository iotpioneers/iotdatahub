"use client";

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useRouter } from "next/navigation";
import { MoneyOffCsredOutlined } from "@mui/icons-material";

const mainListItems = [
  { text: "Overview", icon: <HomeRoundedIcon />, path: "/admin" },
  { text: "Users", icon: <PeopleRoundedIcon />, path: "/admin/users" },
  { text: "Pricing", icon: <MoneyOffCsredOutlined />, path: "/admin/pricing" },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "#" },
  { text: "About", icon: <InfoRoundedIcon />, path: "#" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "#" },
];

export default function MenuContent() {
  const router = useRouter();

  const handleNavigate = React.useCallback((path: string) => {
    router.push(path);
  }, []);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              selected={index === 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
