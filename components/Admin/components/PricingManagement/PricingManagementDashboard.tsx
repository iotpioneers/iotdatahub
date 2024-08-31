"use client";

import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Chip, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import SubscriptionModal from "./SubscriptionModal";

interface Subscription {
  id: string;
  name: string;
  description?: string;
  type: "FREE" | "PREMIUM" | "ENTERPRISE";
  price: number;
  maxChannels: number;
  maxMessagesPerYear: number;
  features: string[];
  activation: boolean;
}

const PricingManagementDashboard: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      // Placeholder data
      setSubscriptions([
        {
          id: "1",
          name: "Free",
          description: "Basic plan for starters",
          type: "FREE",
          price: 0,
          maxChannels: 1,
          maxMessagesPerYear: 10000,
          features: ["1 channel", "10k messages/year"],
          activation: true,
        },
        {
          id: "2",
          name: "Premium",
          description: "Advanced plan for growing businesses",
          type: "PREMIUM",
          price: 49.99,
          maxChannels: 10,
          maxMessagesPerYear: 1000000,
          features: ["10 channels", "1M messages/year", "Priority support"],
          activation: true,
        },
      ]);
    };

    fetchSubscriptions();
  }, []);

  const handleOpenModal = (subscription?: Subscription) => {
    if (subscription) {
      setCurrentSubscription(subscription);
    } else {
      setCurrentSubscription({
        id: "",
        name: "",
        description: "",
        type: "FREE",
        price: 0,
        maxChannels: 0,
        maxMessagesPerYear: 0,
        features: [],
        activation: false,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentSubscription(null);
  };

  const handleDeleteSubscription = async (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      valueFormatter: ({ value }) => `$${value}`,
    },
    { field: "maxChannels", headerName: "Max Channels", width: 130 },
    {
      field: "maxMessagesPerYear",
      headerName: "Max Messages/Year",
      width: 180,
    },
    {
      field: "features",
      headerName: "Features",
      width: 300,
      renderCell: (params) => (
        <Box>
          {params.value.map((feature: string, index: number) => (
            <Chip
              key={index}
              label={feature}
              size="small"
              style={{ margin: "0 2px" }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: "activation",
      headerName: "Active",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteSubscription(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenModal()}
        sx={{ mb: 2 }}
      >
        Add Subscription
      </Button>
      <DataGrid rows={subscriptions} columns={columns} checkboxSelection />
      <SubscriptionModal
        open={openModal}
        onClose={handleCloseModal}
        subscription={currentSubscription}
      />
    </Box>
  );
};

export default PricingManagementDashboard;
