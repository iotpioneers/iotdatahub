"use client";

import React, { useState, useEffect } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import axios from "axios";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { UserData } from "@/types/user";
import { allCountries } from "@/components/CountryList";

// Function to generate a color based on index
function generateColor(index: number, totalCountries: number) {
  const hue = (index / totalCountries) * 360;
  return `hsl(${hue}, 70%, 60%)`;
}

interface StyledTextProps {
  variant: "primary" | "secondary";
}

const StyledText = styled("text", {
  shouldForwardProp: (prop) => prop !== "variant",
})<StyledTextProps>(({ theme }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: theme.palette.text.secondary,
  variants: [
    {
      props: { variant: "primary" },
      style: {
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: { variant: "secondary" },
      style: {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

interface PieCenterLabelProps {
  primaryText: string;
  secondaryText: string;
}

function PieCenterLabel({ primaryText, secondaryText }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

export default function ChartUserByCountry() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        );
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const totalUsers = users.length;

  // Count users by country
  const userCounts: { [key: string]: number } = allCountries.reduce(
    (acc, country) => {
      const count = users.filter(
        (user) => user.country === country.label,
      ).length;
      if (count > 0) {
        acc[country.label] = count;
      }
      return acc;
    },
    {} as { [key: string]: number }, // Add this type cast
  );

  // Sort countries by user count and get top 10
  const topCountries = Object.entries(userCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10);

  const data = topCountries.map(([label, value], index) => ({
    label,
    value,
    color: generateColor(index, topCountries.length),
  }));

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Top Countries
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PieChart
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 90,
                paddingAngle: 0,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel
              primaryText={`${totalUsers}`}
              secondaryText="Total"
            />
          </PieChart>
        </Box>
        {data.map((country, index) => {
          const percentage = (country.value / totalUsers) * 100;
          return (
            <Stack
              key={index}
              direction="row"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                pb: 2,
              }}
            >
              <Stack sx={{ gap: 1, flexGrow: 1 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "500" }}>
                    {country.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {percentage.toFixed(1)}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  aria-label={`Number of users in ${country.label}`}
                  value={percentage}
                  sx={{
                    [`& .${linearProgressClasses.bar}`]: {
                      backgroundColor: country.color,
                    },
                  }}
                />
              </Stack>
            </Stack>
          );
        })}
      </CardContent>
    </Card>
  );
}
