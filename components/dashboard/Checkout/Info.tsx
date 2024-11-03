"use client";

import * as React from "react";
import useSWR from "swr";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Skeleton } from "@mui/material";

interface PricingTier {
  id: string;
  name: string;
  description?: string;
  price: number;
  type: string;
  billingCycle: string;
  maxChannels: number;
  maxMessagesPerYear: number;
  features: string[];
  activation: boolean;
}

interface ProductDisplay {
  name: string;
  desc: string;
  price: string;
}

interface InfoProps {
  subscriptionId: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Info({ subscriptionId }: InfoProps) {
  const { data: pricingTier, error } = useSWR<PricingTier>(
    `/api/pricing/${subscriptionId}`,
    fetcher
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "RWF",
    }).format(price);
  };

  // Transform pricing tier data into product display format with safe checks
  const getProducts = (tier: PricingTier | undefined): ProductDisplay[] => {
    if (!tier) return [];

    const products: ProductDisplay[] = [
      {
        name: tier.name || "Subscription Plan",
        desc: `${tier.billingCycle || "Monthly"} subscription`,
        price: formatPrice(tier.price || 0),
      },
    ];

    // Only add support package if maxChannels exists
    if (tier.maxChannels) {
      products.push({
        name: "Support package",
        desc: `Up to ${tier.maxChannels} channels`,
        price: "Included",
      });
    }

    // Safely add features if they exist
    if (tier.features && Array.isArray(tier.features)) {
      tier.features.forEach((feature) => {
        if (feature) {
          products.push({
            name: feature,
            desc: `Included in ${tier.name || "plan"}`,
            price: "Included",
          });
        }
      });
    }

    return products;
  };

  // Loading state
  if (!pricingTier && !error) {
    return (
      <React.Fragment>
        <List disablePadding>
          {[1, 2, 3].map((index) => (
            <ListItem key={index} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={<Skeleton width={200} />}
                secondary={<Skeleton width={150} />}
              />
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                <Skeleton width={70} />
              </Typography>
            </ListItem>
          ))}
        </List>
      </React.Fragment>
    );
  }

  // Error state
  if (error) {
    return (
      <Typography color="error">
        Error loading pricing information. Please try again later.
      </Typography>
    );
  }

  // Get products from pricing tier data
  const products = getProducts(pricingTier);

  return (
    <React.Fragment>
      <List disablePadding>
        {products.map((product, index) => (
          <ListItem key={`${product.name}-${index}`} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={product.name}
              secondary={product.desc}
            />
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {product.price}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}
