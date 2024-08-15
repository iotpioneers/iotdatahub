//  Material UI
import * as React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import { pricing } from "@/constants";
import AngledButton from "./design/AngledButton";

const PricingList = () => {
  return (
    <Grid container spacing={3} alignItems="center" justifyContent="center">
      {pricing.map((item) => (
        <Grid
          item
          key={item.title}
          xs={12}
          sm={item.title === "Enterprise" ? 12 : 6}
          md={4}
        >
          <div
            key={item.id}
            className="w-[19rem] max-lg:w-full h-full px-6 bg-n-2 border border-n-6 rounded-[2rem] lg:w-auto even:py-14 odd:py-8 odd:my-4 [&>h4]:first:text-color-2 [&>h4]:even:text-color-1 [&>h4]:last:text-color-3"
          >
            <div className="grid md:flex justify-between items-center">
              <Typography component="h1" variant="h2">
                {item.title}
              </Typography>
              {item.title === "Professional" && (
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label={item.subheader}
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
                  }}
                />
              )}
            </div>

            <Typography component="h3" variant="h5" color="white" marginY={2}>
              {item.description}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                color: item.title === "Professional" ? "grey.50" : undefined,
              }}
            >
              <Typography
                component="h1"
                variant="h2"
                className="text-[5.5rem] leading-none font-bold"
              >
                ${item.price}
              </Typography>
              <Typography component="h3" variant="h6">
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
                  item.buttonText === "Start now"
                    ? "https://buy.stripe.com/test_28o3fF8wIbpn4LuaEE"
                    : item.buttonText === "Sign up for free"
                    ? "/register"
                    : "mailto:contact@IoTDataHub.pro"
                }
                white={!!item.price}
              >
                {item.buttonText}
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
              </ul>
            </CardContent>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default PricingList;
