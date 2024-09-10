import React from "react";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
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

// assets
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Member, Organization } from "@/types";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: "50%",
    top: -30,
    right: -180,
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: "50%",
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

interface OrganizarionOverviewProps {
  isLoading: boolean;
  organization: Organization | null;
  members: Member[] | null;
}

const OrganizarionOverviewCard: React.FC<OrganizarionOverviewProps> = ({
  isLoading,
  organization,
  members,
}) => {
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
                      bgcolor: "primary.800",
                      color: "#fff",
                    }}
                  >
                    <GroupsOutlinedIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, my: 0.45 }}
                  primary={
                    <Typography variant="h4" sx={{ color: "#fff" }}>
                      {organization?.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "primary.light", mt: 0.25 }}
                    >
                      {members && members!.length > 1
                        ? `${members?.length} Members`
                        : "1 Member"}
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

export default OrganizarionOverviewCard;
