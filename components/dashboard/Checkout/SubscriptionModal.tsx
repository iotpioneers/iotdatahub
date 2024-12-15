"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  CardActions,
  CardContent,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PricingPlanType } from "@/types";
import AngledButton from "../../Home/components/design/AngledButton";

const SubscriptionModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [subscriptions, setSubscriptions] = useState<PricingPlanType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/pricing`
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchSubscriptions();
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="subscription-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1200,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography
          id="subscription-modal-title"
          variant="h1"
          component="h2"
          gutterBottom
        >
          Choose a Subscription Plan 
        </Typography>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {isLoading && <LoadingSpinner />}
          {subscriptions.map((item) => (
            <Grid
              item
              key={item.name}
              xs={12}
              sm={item.name === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "19rem" },
                  height: "100%",
                  px: 3,
                  py: item.name === "Premium" ? 7 : 4,
                  my: item.name !== "Premium" ? 2 : 0,
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 4,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" component="h4">
                    {item.name}
                  </Typography>
                  {item.name === "Premium" && (
                    <Chip
                      icon={<AutoAwesomeIcon />}
                      label="Recommended"
                      size="small"
                      sx={{
                        bgcolor: "primary.contrastText",
                        "& .MuiChip-label": {
                          color: "primary.dark",
                        },
                        "& .MuiChip-icon": {
                          color: "primary.dark",
                        },
                        my: { sm: 1, md: 0 },
                      }}
                    />
                  )}
                </Box>

                <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "baseline" }}>

                  {item.price === 0 ? (
                    <Typography
                      variant="h4"
                      component="span"
                      sx={{ fontWeight: "bold" }}
                    >
                      Free
                    </Typography>
                  ):(
                    
                  <Typography
                    variant="h4"
                    component="span"
                    sx={{ fontWeight: "bold" }}
                  >
                    Rwf{item.price} &nbsp; per month
                  </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2, opacity: 0.2 }} />

                <CardActions>
                  <AngledButton
                    className="w-full mb-6"
                    href={
                      item.price === 0
                        ? "/signup"
                        : item.name === "Enterprise"
                        ? "#"
                        : "https://buy.stripe.com/test_9AQ5nNdR2653a5OcMN"
                    }
                    white={!!item.price}
                  >
                    {item.activation && item.name === "Enterprise"
                      ? "Contact us"
                      : item.price === 0
                      ? "Try for free"
                      : "Get started"}
                  </AngledButton>
                </CardActions>

                <CardContent>
                  <ul>
                    {item.features.map((feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          padding: "10px 0",
                          borderTop: "1px solid #e0e0e0",
                        }}
                      >
                        <img
                          src="check.svg"
                          width={24}
                          height={24}
                          alt="Check"
                          style={{ marginRight: "10px" }}
                        />
                        <Typography variant="body2">{feature}</Typography>
                      </li>
                    ))}
                    <li
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        padding: "10px 0",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <img
                        src="check.svg"
                        width={24}
                        height={24}
                        alt="Check"
                        style={{ marginRight: "10px" }}
                      />
                      <Typography variant="body2">
                        {item.maxChannels} Maximum channels
                      </Typography>
                    </li>
                    <li
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        padding: "10px 0",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <img
                        src="check.svg"
                        width={24}
                        height={24}
                        alt="Check"
                        style={{ marginRight: "10px" }}
                      />
                      <Typography variant="body2">
                        {item.maxMessagesPerYear > 1000000000000
                          ? `${item.maxMessagesPerYear / 1000000000000}T`
                          : item.maxMessagesPerYear > 1000000000
                          ? `${item.maxMessagesPerYear / 1000000000}B`
                          : item.maxMessagesPerYear > 1000000
                          ? `${item.maxMessagesPerYear / 1000000}M`
                          : item.maxMessagesPerYear > 1000
                          ? `${item.maxMessagesPerYear / 1000}K`
                          : item.maxMessagesPerYear}{" "}
                        Maximum messages
                      </Typography>
                    </li>
                  </ul>
                </CardContent>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;
