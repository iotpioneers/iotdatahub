import React from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

// project imports
import MainCard from "../cards/MainCard";
import SkeletonTotalDatGeneratedLightCard from "../cards/Skeleton/SkeletonTotalDatGeneratedLightCard";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: "50%",
    top: -30,
    right: -180,
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: "50%",
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

interface TotalDatGeneratedLightCardProps {
  icon: JSX.Element;
  label: string;
  total: number;
  isLoading: boolean;
}

const formatTotal = (total: number): string => {
  if (total === 0) {
    return "No data generated yet";
  } else if (total >= 1_000_000) {
    return (total / 1_000_000).toFixed(1) + "M generated";
  } else if (total >= 1_000) {
    return (total / 1_000).toFixed(1) + "k generated";
  } else {
    return total.toString();
  }
};

const TotalDataGeneratedCard = ({
  isLoading,
  total,
  icon,
  label,
}: TotalDatGeneratedLightCardProps) => {
  const theme = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalDatGeneratedLightCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: "warning.light",
                      color:
                        label === "Meeting attends"
                          ? "error.dark"
                          : "warning.dark",
                    }}
                  >
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                  primary={
                    <Typography variant="h4">{formatTotal(total)}</Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "grey.500", mt: 0.5 }}
                    >
                      {label}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalDataGeneratedCard;
