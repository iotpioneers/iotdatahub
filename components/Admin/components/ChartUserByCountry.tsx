import * as React from "react";
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

// You'll need to create these flag components
import {
  BurundiFlag,
  KenyaFlag,
  RwandaFlag,
  SouthSudanFlag,
  TanzaniaFlag,
  UgandaFlag,
  DRCFlag,
} from "../internals/components/CustomIcons";

const data = [
  { label: "Kenya", value: 30000 },
  { label: "Tanzania", value: 25000 },
  { label: "Uganda", value: 20000 },
  { label: "DRC", value: 15000 },
  { label: "Rwanda", value: 5000 },
  { label: "South Sudan", value: 3000 },
  { label: "Burundi", value: 2000 },
];

const countries = [
  {
    name: "Kenya",
    value: 30,
    flag: <KenyaFlag />,
    color: "hsl(220, 25%, 65%)",
  },
  {
    name: "Tanzania",
    value: 25,
    flag: <TanzaniaFlag />,
    color: "hsl(220, 25%, 55%)",
  },
  {
    name: "Uganda",
    value: 20,
    flag: <UgandaFlag />,
    color: "hsl(220, 25%, 45%)",
  },
  {
    name: "DRC",
    value: 15,
    flag: <DRCFlag />,
    color: "hsl(220, 25%, 35%)",
  },
  {
    name: "Rwanda",
    value: 5,
    flag: <RwandaFlag />,
    color: "hsl(220, 25%, 25%)",
  },
  {
    name: "South Sudan",
    value: 3,
    flag: <SouthSudanFlag />,
    color: "hsl(220, 25%, 15%)",
  },
  {
    name: "Burundi",
    value: 2,
    flag: <BurundiFlag />,
    color: "hsl(220, 25%, 5%)",
  },
];

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
      props: {
        variant: "primary",
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: "primary",
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== "primary",
      style: {
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

const colors = [
  "hsl(220, 20%, 65%)",
  "hsl(220, 20%, 55%)",
  "hsl(220, 20%, 45%)",
  "hsl(220, 20%, 35%)",
  "hsl(220, 20%, 25%)",
  "hsl(220, 20%, 15%)",
  "hsl(220, 20%, 5%)",
];

export default function ChartUserByCountry() {
  const totalUsers = data.reduce((sum, country) => sum + country.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          Users by country
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 100,
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
              primaryText={`${(totalUsers / 1000).toFixed(1)}K`}
              secondaryText="Total"
            />
          </PieChart>
        </Box>
        {countries.map((country, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{ alignItems: "center", gap: 2, pb: 2 }}
          >
            {country.flag}
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
                  {country.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {country.value}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                aria-label="Number of users by country"
                value={country.value}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: country.color,
                  },
                }}
              />
            </Stack>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}
