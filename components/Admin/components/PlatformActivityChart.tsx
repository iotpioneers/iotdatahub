import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import axios from "axios";

interface AreaGradientProps {
  color: string;
  id: string;
}

function AreaGradient({ color, id }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

interface DataItem {
  [key: string]: any;
  createdAt?: string;
  date: string;
}

interface ChartDataItem {
  date: string;
  value: number;
}

interface ChartData {
  devices: ChartDataItem[];
  channels: ChartDataItem[];
  dataPoints: ChartDataItem[];
  users: ChartDataItem[];
  organizations: ChartDataItem[];
  fields: ChartDataItem[];
}

export default function PlatformActivityChart() {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState<ChartData>({
    devices: [],
    channels: [],
    dataPoints: [],
    users: [],
    organizations: [],
    fields: [],
  });
  const [totalActivity, setTotalActivity] = React.useState(0);
  const [percentageChange, setPercentageChange] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/overview");
        const { devices, channels, dataPoints, users, organizations, fields } =
          response.data;

        // Process the data
        const processedData = {
          devices: processTimeSeriesData(devices, "createdAt"),
          channels: processTimeSeriesData(channels, "createdAt"),
          dataPoints: processTimeSeriesData(dataPoints, "createdAt"),
          users: processTimeSeriesData(users, "createdAt"),
          organizations: processTimeSeriesData(organizations, "createdAt"),
          fields: processTimeSeriesData(fields, "createdAt"),
        };

        setChartData(processedData);

        const totalCount = Object.values(processedData).reduce(
          (acc, curr) => acc + curr.reduce((sum, item) => sum + item.value, 0),
          0
        );
        setTotalActivity(totalCount);

        // Calculate percentage change
        const change = calculatePercentageChange(processedData);
        setPercentageChange(change);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTimeSeriesData = (
    data: DataItem[],
    dateField: string
  ): ChartDataItem[] => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return data
      .filter((item) => new Date(item[dateField]) >= thirtyDaysAgo)
      .map((item) => ({
        date: new Date(item[dateField]).toISOString().split("T")[0],
        value: 1,
      }))
      .reduce((acc: ChartDataItem[], curr) => {
        const existingEntry = acc.find((item) => item.date === curr.date);
        if (existingEntry) {
          existingEntry.value += curr.value;
        } else {
          acc.push(curr);
        }
        return acc;
      }, [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculatePercentageChange = (data: ChartData): number => {
    const allDates = Array.from(
      new Set(
        Object.values(data)
          .flatMap((series) => series.map((item: DataItem) => item.date))
          .sort()
      )
    );

    if (allDates.length < 2) return 0; // Not enough data to calculate change

    const firstWeekDates = allDates.slice(0, 7);
    const lastWeekDates = allDates.slice(-7);

    const calculateWeekTotal = (dates: string[]) => {
      return dates.reduce((total, date) => {
        return (
          total +
          Object.values(data).reduce((dayTotal, series) => {
            const item = series.find((i: DataItem) => i.date === date);
            return dayTotal + (item ? item.value : 0);
          }, 0)
        );
      }, 0);
    };

    const firstWeekTotal = calculateWeekTotal(firstWeekDates);
    const lastWeekTotal = calculateWeekTotal(lastWeekDates);

    if (firstWeekTotal === 0) return lastWeekTotal > 0 ? 100 : 0;

    const percentageChange =
      ((lastWeekTotal - firstWeekTotal) / firstWeekTotal) * 100;
    return Math.round(percentageChange);
  };

  const colorPalette = [
    theme.palette.error.light,
    theme.palette.grey[800],
    theme.palette.warning.light,
    theme.palette.success.light,
    theme.palette.secondary.main,
    theme.palette.primary.main,
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const allDates = Array.from(
    new Set(
      Object.values(chartData)
        .flatMap((data) => data.map((item: { date: string }) => item.date))
        .sort()
    )
  );

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Activities
        </Typography>
        <Stack sx={{ justifyContent: "space-between" }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: "center", sm: "flex-start" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {totalActivity}
            </Typography>
            <Chip
              size="small"
              color={percentageChange >= 0 ? "success" : "error"}
              label={`${percentageChange >= 0 ? "+" : ""}${percentageChange}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Total activity in the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: "point",
              data: allDates,
              tickInterval: (index: number) => index % 5 === 0,
            },
          ]}
          series={Object.entries(chartData).map(([key, data]) => ({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            showMark: false,
            curve: "linear",
            stack: "total",
            area: true,
            stackOrder: "ascending",
            data: allDates.map(
              (date) =>
                data.find((item: { date: string }) => item.date === date)
                  ?.value || 0
            ),
          }))}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          sx={Object.fromEntries(
            Object.keys(chartData).map((key) => [
              `& .MuiAreaElement-series-${key}`,
              { fill: `url('#${key}')` },
            ])
          )}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          {Object.keys(chartData).map((key, index) => (
            <AreaGradient
              key={key}
              color={colorPalette[index % colorPalette.length]}
              id={key}
            />
          ))}
        </LineChart>
      </CardContent>
    </Card>
  );
}
