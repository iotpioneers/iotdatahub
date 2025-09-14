"use client";

import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { EmployeeMember } from "@/types/employees-member";
import AddMember from "./members/AddMember";
import { LinearLoading } from "@/components/LinearLoading";

const OrganizationUserManagement = (): React.JSX.Element => {
  const [members, setMembers] = useState<EmployeeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/organizations/status", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Error fetching organization status");
        }

        const data = await response.json();
        setMembers(data.members);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewMember = (newMember: EmployeeMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  const handleEdit = (id: string) => {
    console.log("Edit user:", id);
  };

  const handleView = (id: string) => {
    console.log("View user:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete user:", id);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <img
            src={params.row.avatar}
            alt={params.row.name}
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <Typography>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Location",
      flex: 1,
      renderCell: (params) => (
        <span>
          {params.row.address?.city}, {params.row.address?.state}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Member Since",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEdit(params.row.id)} size="small">
            <EditIcon fontSize="small" color="primary" />
          </IconButton>
          <IconButton onClick={() => handleView(params.row.id)} size="small">
            <VisibilityIcon fontSize="small" color="info" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (loading) {
    return <LinearLoading />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <div>
          <AddMember onNewMember={handleNewMember} />
        </div>
      </Stack>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={members}
          columns={columns}
          pagination
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(newModel) => {
            setPage(newModel.page);
            setPageSize(newModel.pageSize);
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Stack>
  );
};

export default OrganizationUserManagement;
