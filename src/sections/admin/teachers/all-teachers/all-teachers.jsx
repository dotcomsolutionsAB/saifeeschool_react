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
import AllTeachersTableRow from "./all-teachers-table-row";
import { getTeachers } from "../../../../services/admin/teacher.service";
import AddNewTeacherModal from "./modals/add-new-teacher";
import { getBloodGroups } from "../../../../services/admin/students-management.service";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "email", label: "Email" },
  { id: "is_class_teacher", label: "Class Teacher", align: "center" },
  { id: "mobile", label: "Mobile" },
  { id: "subject", label: "Subject" },
  { id: "", label: "", align: "center" },
];

export default function AllTeachers() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");

  // api to get bloodGroupList
  const { dataList: bloodGroupList } = useGetApi({
    apiFunction: getBloodGroups,
  });

  // api to get products list
  const {
    dataCount: teachersCount,
    dataList: teachersList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getTeachers,
    body: {
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      search,
    },
    dependencies: [page, rowsPerPage, search],
    debounceDelay: 500,
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
  const notFound = !teachersCount;

  return (
    <>
      <Helmet>
        <title>All Teachers | SAIFEE</title>
      </Helmet>
      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            width: "100%",
          }}
        >
          <Typography variant="h4">All Teachers</Typography>

          {/* Add New Teacher*/}
          <Button variant="contained" onClick={handleModalOpen}>
            + Add New Teacher
          </Button>

          {/* Modal */}
          <AddNewTeacherModal
            open={modalOpen}
            onClose={handleModalClose}
            refetch={refetch}
            genderList={["M", "F"]}
            classTeacher={["1", "0"]}
            bloodGroupList={bloodGroupList}
          />
        </Box>
        {/* Search  */}
        <TextField
          value={search || ""}
          onChange={handleSearch}
          placeholder="Search by name,email,mobile,subject"
          size="small"
          sx={{ width: "clamp(250px, 40%, 350px)", mb: 2, mt: 1 }}
        />

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
                {teachersList?.map((row, index) => (
                  <AllTeachersTableRow
                    key={row?.id}
                    index={index}
                    refetch={refetch}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    row={row}
                    genderList={["M", "F"]}
                    classTeacher={["1", "0"]}
                    bloodGroupList={bloodGroupList}
                  />
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, teachersCount)}
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
          count={teachersCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
