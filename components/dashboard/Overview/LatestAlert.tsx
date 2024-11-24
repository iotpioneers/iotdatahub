import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import dayjs from "dayjs";

const statusMap = {
  critical: { label: "Critical", color: "warning" },
  resolved: { label: "Resolved", color: "success" },
  investigating: { label: "Investigating", color: "error" },
} as const;

export interface Alert {
  id: string;
  alert: { name: string };
  amount: number;
  status: "investigating" | "resolved" | "critical";
  createdAt: Date;
}

export interface LatestAlertsProps {
  alerts?: Alert[];
  sx?: SxProps;
}

export function LatestAlert({
  alerts: alerts = [],
  sx,
}: LatestAlertsProps): React.JSX.Element {
  return (
    <Card sx={sx}>
      <CardHeader title="Latest Alerts" />
      <Divider />
      <Box sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Ref-ID</TableCell>
              <TableCell>Alert</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((order) => {
              const { label, color } = statusMap[order.status] ?? {
                label: "Unknown",
                color: "default",
              };

              return (
                <TableRow hover key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.alert.name}</TableCell>
                  <TableCell>
                    {dayjs(order.createdAt).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip color={color} label={label} size="small" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
