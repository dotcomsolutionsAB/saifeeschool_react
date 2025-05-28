import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../../components/table/table-no-data";
import TableEmptyRows from "../../../../components/table/table-empty-rows";

import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import { Helmet } from "react-helmet-async";
import UsersTableRow from "./users-table-row";
import { getUsers } from "../../../../services/admin/users.service";
import AddNewUserModal from "./modals/add-new-user";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "username", label: "Username" },
  { id: "mobile", label: "Mobile" },
  { id: "email", label: "Email" },
  { id: "role", label: "User Role" },
  { id: "", label: "", align: "center" },
];

export default function Users() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");

  // api to get products list
  const {
    dataCount: usersCount,
    dataList: usersList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getUsers,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      search,
    },
    dependencies: [page, rowsPerPage, search],
  });

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  // change to next or prev page
  const handleChangePage = (_, newPage) => {
    if (!isLoading) setPage(newPage);
  };

  // change rows per page
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // if no search result is found
  const notFound = !usersCount;

  return (
    <>
      <Helmet>
        <title>Users | SAIFEE</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
        <Typography variant="h4">Users</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 1,
            mb: 2,
            width: "100%",
          }}
        >
          {/* Search  */}
          <TextField
            value={search || ""}
            onChange={handleSearch}
            placeholder="Search"
            size="small"
            sx={{ maxWidth: "300px" }}
          />

          {/* Add New User*/}
          <Button variant="contained" onClick={handleModalOpen}>
            + Add New User
          </Button>

          {/* Modal */}
          <AddNewUserModal
            open={modalOpen}
            onClose={handleModalClose}
            refetch={refetch}
            userTypeList={["admin", "student", "teacher", "procurement"]}
          />
        </Box>

        {/* Table */}
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <TableContainer sx={{ overflowY: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {HEAD_LABEL?.map((headCell) => (
                    <TableCell
                      key={headCell?.id}
                      align={headCell?.align || "left"}
                      sx={{
                        width: headCell?.width,
                        minWidth: headCell?.minWidth,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {usersList?.map((row, index) => (
                  <UsersTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    row={row}
                    userTypeList={[
                      "admin",
                      "student",
                      "teacher",
                      "procurement",
                    ]}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, usersCount)}
                />

                {notFound && <TableNoData query="" />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={usersCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
