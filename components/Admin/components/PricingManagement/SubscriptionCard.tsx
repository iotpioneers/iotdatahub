import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { PricingPlanType } from "@/types";

interface SubscriptionCardProps {
  subscription: PricingPlanType;
  onSubscribe: (subscriptionId: string, paymentMethodId: string) => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onSubscribe,
}) => {
  const handleSubscribe = () => {
    // TODO: Implement payment method selection
    // onSubscribe(subscription.id, "payment-method-id");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{subscription.name}</Typography>
        <Typography variant="body1">{subscription.description}</Typography>
        <Typography variant="h6">Price: ${subscription.price}</Typography>
        <Typography variant="body2">
          Max Channels: {subscription.maxChannels}
        </Typography>
        <Typography variant="body2">
          Max Messages per Year: {subscription.maxMessagesPerYear}
        </Typography>
        <Typography variant="body2">
          Features: {subscription.features.join(", ")}
        </Typography>
        <Button variant="contained" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;
