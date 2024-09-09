"use client";

//  Material UI
import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import AngledButton from "./design/AngledButton";
import axios from "axios";
import { PricingPlanType } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

const PricingList = () => {
  const [subscriptions, setSubscriptions] = React.useState<PricingPlanType[]>(
    []
  );
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
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

    fetchSubscriptions();
  }, []);
  return (
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      {IsLoading && <LoadingSpinner />}
      {subscriptions.map((item) => (
        <Grid
          item
          key={item.name}
          xs={12}
          sm={item.name === "Enterprise" ? 12 : 6}
          md={4}
        >
          <div
            key={item.id}
            className="w-[19rem] max-lg:w-full h-full px-6 bg-n-2 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
          >
            <div className="grid md:flex justify-between items-center">
              <Typography component="h4" variant="h5">
                {item.name}
              </Typography>
              {item.name === "Premium" && (
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="Recommended"
                  size="small"
                  sx={{
                    background: "",
                    backgroundColor: "primary.contrastText",
                    "& .MuiChip-label": {
                      color: "primary.dark",
                    },
                    "& .MuiChip-icon": {
                      color: "primary.dark",
                    },
                    marginY: { sm: 1, md: 0 },
                    width: "100%",
                  }}
                />
              )}
            </div>

            <Typography
              component="h3"
              variant="h5"
              color="dodgerblue"
              marginY={2}
            >
              {item.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                color: item.name === "Premium" ? "grey.50" : undefined,
              }}
            >
              <Typography
                component="h4"
                variant="h5"
                className="text-[2.5rem] leading-none font-bold"
              >
                ${item.price}
              </Typography>
              <Typography component="h6" variant="h6">
                &nbsp; per month
              </Typography>
            </Box>

            <Divider
              sx={{
                my: 2,
                opacity: 0.2,
                borderColor: "grey.500",
              }}
            />

            <CardActions>
              <AngledButton
                className="w-full mb-6"
                href={
                  item.price === 0
                    ? "/signup"
                    : item.name === "Enterprise"
                    ? "#"
                    : "https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE"
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
                    className="flex items-start py-5 border-t border-n-6"
                  >
                    <img src="check.svg" width={24} height={24} alt="Check" />
                    <p className="body-2 text-n-1 ml-4">{feature}</p>
                  </li>
                ))}
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="check.svg" width={24} height={24} alt="Check" />
                  <p className="body-2 text-n-1 ml-4">
                    {item.maxChannels} Maximun channels
                  </p>
                </li>
                <li className="flex items-start py-5 border-t border-n-6">
                  <img src="check.svg" width={24} height={24} alt="Check" />
                  <p className="body-2 text-n-1 ml-4">
                    {item.maxMessagesPerYear > 1000000000000
                      ? `${item.maxMessagesPerYear / 1000000000000}T`
                      : item.maxMessagesPerYear > 1000000000
                      ? `${item.maxMessagesPerYear / 1000000000}B`
                      : item.maxMessagesPerYear > 1000000
                      ? `${item.maxMessagesPerYear / 1000000}M`
                      : item.maxMessagesPerYear > 1000
                      ? `${item.maxMessagesPerYear / 1000}K`
                      : item.maxMessagesPerYear}{" "}
                    Maximun messages
                  </p>
                </li>
              </ul>
            </CardContent>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PricingList;
