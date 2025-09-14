"use client";

import * as React from "react";
import {
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

import {
  DataGrid,
  GridCellParams,
  GridRowsProp,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import axios from "axios";

type SparkLineData = number[];

function getLastNDays(n: number) {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    );
  }
  return result;
}

function renderSparklineCell(params: GridCellParams<SparkLineData, any>) {
  const data = getLastNDays(30);
  const { value, colDef } = params;

  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={value}
        width={colDef.computedWidth || 100}
        height={32}
        plotType="line"
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
        xAxis={{
          scaleType: "band",
          data,
        }}
      />
    </div>
  );
}

function renderRole(role: "ADMIN" | "USER") {
  const colors: { [index: string]: "error" | "primary" } = {
    ADMIN: "error",
    USER: "primary",
  };

  return <Chip label={role} color={colors[role]} size="small" />;
}

export function renderAvatar(
  params: GridCellParams<
    { name: string; color: string; image?: string },
    any,
    any
  >,
) {
  if (params.value == null) {
    return "";
  }

  if (params.value.image) {
    return (
      <Avatar
        src={params.value.image}
        alt={params.value.name}
        sx={{
          width: "32px",
          height: "32px",
          mt: "5px",
        }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: "32px",
        height: "32px",
        mt: "5px",
        fontSize: "1rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export default function UserManagementDashboard() {
  const [rows, setRows] = React.useState<GridRowsProp>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [editedRole, setEditedRole] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [actionLoading, setActionLoading] = React.useState(false);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/users/overview",
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.data;
      const formattedData = data.map((user: any) => ({
        ...user,
        avatar: {
          name: user.name,
          color: getRandomColor(),
          image: user.image,
        },
      }));
      setRows(formattedData);
    } catch (error) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    try {
      setActionLoading(true);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
      );
      await fetchUsers();
      setSuccess("User deleted successfully");
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
    }
  }

  async function updateUserRole(userId: string, newRole: string) {
    try {
      setActionLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
        { role: newRole },
      );
      await fetchUsers();
      setSuccess("User role updated successfully");
    } catch (error) {
      setError("Failed to update user role. Please try again.");
    } finally {
      setActionLoading(false);
      setViewDialogOpen(false);
    }
  }

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (user: any) => {
    setSelectedUser(user);
    setEditedRole(user.role);
    setViewDialogOpen(true);
  };

  const handleRoleChange = (event: SelectChangeEvent<{ value: unknown }>) => {
    setEditedRole(event.target.value as string);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  function getRandomColor() {
    const colors = [
      "#1976d2",
      "#388e3c",
      "#f57c00",
      "#d32f2f",
      "#7b1fa2",
      "#0288d1",
      "#fbc02d",
      "#00796b",
      "#e64a19",
      "#5e35b1",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 60,
      renderCell: renderAvatar,
    },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.7,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) =>
        renderRole(params.value as "ADMIN" | "USER"),
    },
    {
      field: "devices",
      headerName: "Devices",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "channels",
      headerName: "Channels",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "fields",
      headerName: "Fields",
      headerAlign: "right",
      align: "right",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "dataUploads",
      headerName: "Data Uploads",
      headerAlign: "right",
      align: "right",
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: "activityTrend",
      headerName: "Activity Trend",
      flex: 1,
      minWidth: 150,
      renderCell: renderSparklineCell,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleViewClick(params.row)}>Edit</Button>
          <Button onClick={() => handleDeleteClick(params.row)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {loading ? (
        <LoadingProgressBar />
      ) : (
        <>
          <Box m="40px 0 0 0" height="75vh">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              pageSizeOptions={[5, 10, 20, 50, 100]}
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
            />
          </Box>
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete {selectedUser?.name}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteUser(selectedUser?.id)}
                color="error"
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={24} /> : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
          >
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                value={selectedUser?.name || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={selectedUser?.email || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={editedRole}
                  onChange={handleRoleChange}
                  label="Role"
                >
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Devices"
                type="number"
                fullWidth
                value={selectedUser?.devices || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Channels"
                type="number"
                fullWidth
                value={selectedUser?.channels || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Fields"
                type="number"
                fullWidth
                value={selectedUser?.fields || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                margin="dense"
                label="Data Uploads"
                type="number"
                fullWidth
                value={selectedUser?.dataUploads || ""}
                InputProps={{
                  readOnly: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setViewDialogOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateUserRole(selectedUser?.id, editedRole)}
                disabled={actionLoading || editedRole === selectedUser?.role}
              >
                {actionLoading ? <CircularProgress size={24} /> : "Update Role"}
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={!!error || !!success}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={error ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {error || success}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
}
