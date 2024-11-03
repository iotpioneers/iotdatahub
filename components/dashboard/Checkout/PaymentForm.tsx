"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import { PhoneAndroidRounded } from "@mui/icons-material";

import MobileMoneyForm from "./MobileMoneyForm";

interface Props {
  subscriptionId: string;
}

const Card = styled(MuiCard)<{ selected?: boolean }>(({ theme }) => ({
  border: "1px solid",
  borderColor: theme.palette.divider,
  width: "100%",
  "&:hover": {
    background:
      "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
    borderColor: "primary.light",
    boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
    ...theme.applyStyles("dark", {
      background:
        "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
      borderColor: "primary.dark",
      boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5) ",
    }),
  },
  [theme.breakpoints.up("md")]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        borderColor: theme.palette.primary.light,
        ...theme.applyStyles("dark", {
          borderColor: theme.palette.primary.dark,
        }),
      },
    },
  ],
}));

export default function PaymentForm({ subscriptionId }: Props) {
  const router = useRouter();
  const [paymentType, setPaymentType] = React.useState("creditCard");

  const handlePaymentTypeChange = (event: { target: { value: string } }) => {
    const newPaymentType = event.target.value;
    setPaymentType(newPaymentType);

    if (newPaymentType === "creditCard") {
      router.push("https://buy.stripe.com/test_9AQ5nNdR2653a5OcMN");
    }
  };

  const handleCardClick = (type: string) => {
    setPaymentType(type);
    if (type === "creditCard") {
      router.push("https://buy.stripe.com/test_9AQ5nNdR2653a5OcMN");
    }
  };

  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          aria-label="Payment options"
          name="paymentType"
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Card selected={paymentType === "creditCard"}>
            <CardActionArea
              onClick={() => handleCardClick("creditCard")}
              sx={{
                ".MuiCardActionArea-focusHighlight": {
                  backgroundColor: "transparent",
                },
                "&:focus-visible": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CreditCardRoundedIcon
                  fontSize="small"
                  sx={[
                    (theme) => ({
                      color: "grey.400",
                      ...theme.applyStyles("dark", {
                        color: "grey.600",
                      }),
                    }),
                    paymentType === "creditCard" && {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Debit / Credit Card
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card selected={paymentType === "momo"}>
            <CardActionArea
              onClick={() => handleCardClick("momo")}
              sx={{
                ".MuiCardActionArea-focusHighlight": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PhoneAndroidRounded
                  fontSize="small"
                  sx={[
                    { color: "grey.400" },
                    paymentType === "momo" && {
                      color: "primary.main",
                    },
                  ]}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Mobile Money
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>
      {paymentType === "momo" && (
        <MobileMoneyForm subscriptionId={subscriptionId} />
      )}
    </Stack>
  );
}
