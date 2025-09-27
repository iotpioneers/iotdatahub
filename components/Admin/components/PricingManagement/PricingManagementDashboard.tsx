"use client";

import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Chip, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AddSubscriptionModal from "./AddSubscriptionModal";
import axios from "axios";
import LoadingProgressBar from "@/components/loading-progress-bar";

interface Subscription {
  id: string;
  name: string;
  description?: string;
  type: "FREE" | "PREMIUM" | "ENTERPRISE";
  billingCycle: "MONTHLY" | "YEARLY";
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
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing`
        );

        setSubscriptions(response.data);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [openModal, currentSubscription]);

  const handleOpenModal = (subscription?: Subscription) => {
    if (subscription) {
      setCurrentSubscription(subscription);
    } else {
      setCurrentSubscription({
        id: "",
        name: "",
        description: "",
        type: "FREE",
        billingCycle: "MONTHLY",
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
        Add A NEW SUBSCRIPTION PLAN
      </Button>
      {IsLoading ? <LoadingProgressBar /> : null}
      {subscriptions.length > 0 && (
        <DataGrid
          rows={subscriptions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          autoHeight
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
        />
      )}
      <AddSubscriptionModal
        open={openModal}
        onClose={handleCloseModal}
        subscription={currentSubscription}
      />
    </Box>
  );
};

export default PricingManagementDashboard;
