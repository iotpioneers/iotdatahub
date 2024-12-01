"use client";

import { useState } from "react";
import {
  Checkbox,
  TableRow,
  TableCell,
  Avatar,
  Stack,
  Typography,
  IconButton,
  Popover,
  MenuItem,
} from "@mui/material";
import Label from "./label";
import Iconify from "./Iconify";

// Define the types for props
interface UserTableRowProps {
  selected: boolean;
  name: string;
  email: string;
  avatarUrl: string;
  country: string;
  role: string;
  createdAt: Date;
  handleClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => void;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function UserTableRow({
  selected,
  name,
  email,
  avatarUrl,
  country,
  role,
  createdAt,
  handleClick,
}: UserTableRowProps) {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={(event) => handleClick(event, name)}
          />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{country}</TableCell>

        <TableCell>
          <Label
            color={
              role === "VIEWER"
                ? "primary"
                : role === "COMMENTER"
                ? "secondary"
                : "success"
            }
          >
            {role}
          </Label>
        </TableCell>
        <TableCell>{formatDate(createdAt)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
