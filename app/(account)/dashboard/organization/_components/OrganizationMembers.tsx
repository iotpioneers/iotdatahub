"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Scrollbar from "../_components/scrollbar";
import TableNoData from "../_components/TableNoData";
import UserTableRow from "../_components/UserTableRow";
import UserTableHead from "../_components/UserTableHead";
import TableEmptyRows from "../_components/TableEmptyRows";
import UserTableToolbar from "../_components/UserTableToolbar";
import AddMember from "../_components/members/AddMember";
import { emptyRows, applyFilter, getComparator } from "../_components/utils";
import LoadingSpinner from "@/components/LoadingSpinner";

// Define the types for organization
interface Organization {
  areaOfInterest: string;
  createdAt: Date;
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
  userId: string;
}

// Define the types for member
interface Member {
  country: string;
  avatar: string;
  access: string;
  createdAt: Date;
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
  userId: string;
  organizationId: string;
}

const OrganizationMembers = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [hasOrganization, setHasOrganization] = useState<boolean | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

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
        setHasOrganization(data.hasOrganization);
        setOrganization(data.organization);
        setMembers(data.members);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewMember = (newMember: Member) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hasOrganization || !organization) {
    return (
      <div>No organization found. Please create an organization first.</div>
    );
  }

  const handleSort = (event: React.MouseEvent<unknown>, id: string) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = members.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: members,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Members</Typography>
        <AddMember onNewMember={handleNewMember} />
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={members.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: "name", label: "Name" },
                  { id: "email", label: "Email" },
                  { id: "country", label: "Country" },
                  { id: "access", label: "Access" },
                  { id: "date", label: "Joined" },
                  { id: "actions", label: "" },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      email={row.email}
                      role={row.access}
                      country={row.country}
                      avatarUrl={row.avatar}
                      createdAt={row.createdAt}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, members.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={members.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default OrganizationMembers;
