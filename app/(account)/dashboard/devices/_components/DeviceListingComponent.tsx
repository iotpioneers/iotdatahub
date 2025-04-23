"use client";

import React, { JSXElementConstructor, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tab,
  Tabs,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  GridView as GridViewIcon,
  List as ListIcon,
} from "@mui/icons-material";
import DeviceCard from "./DeviceCard";
import { DeviceData } from "@/types/device";
import NewDeviceModal from "./NewDeviceModal";
import DeviceTable from "./DeviceTable";

interface ViewMode {
  value: "table" | "grid";
  icon:
    | React.ReactElement<any, string | JSXElementConstructor<any>>
    | string
    | undefined;
  label: string;
}

const viewModes: ViewMode[] = [
  { value: "table", icon: <ListIcon />, label: "Table" },
  { value: "grid", icon: <GridViewIcon />, label: "Grid" },
];

const DeviceListingComponent: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices`,
      );
      if (!response.ok) throw new Error("Failed to fetch devices");
      const data: DeviceData[] = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch device");
      const device = await response.json();
      // Handle edit logic
      console.log("Edit device:", device);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedDeviceId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDeviceId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/devices/${selectedDeviceId}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Failed to delete device");
      await fetchDevices();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeviceId(null);
    }
  };

  const handleView = (id: string) => {
    // Handle view logic
    console.log("View device:", id);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", paddingX: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Box
          sx={{
            display: "grid",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h1" component="h1">
            My Devices
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <NewDeviceModal />
            <Tabs
              value={viewMode}
              onChange={(_, newValue) => setViewMode(newValue)}
              aria-label="view mode tabs"
            >
              {viewModes.map((mode) => (
                <Tab
                  key={mode.value}
                  value={mode.value}
                  icon={mode.icon}
                  label={mode.label}
                />
              ))}
            </Tabs>
          </Box>
        </Box>
      </Box>

      {viewMode === "table" && (
        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <DeviceTable isLoading={isLoading} devices={devices} />
        </TableContainer>
      )}

      {viewMode === "grid" && (
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <DeviceCard
                device={device}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this device?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeviceListingComponent;
