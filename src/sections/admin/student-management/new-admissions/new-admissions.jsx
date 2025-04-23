import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../../components/table/table-no-data";
import TableEmptyRows from "../../../../components/table/table-empty-rows";

import {
  getAllAcademicYears,
  getClasses,
  getNewAdmissions,
} from "../../../../services/admin/students-management.service";
import useAuth from "../../../../hooks/useAuth";
import {
  Autocomplete,
  Avatar,
  Box,
  IconButton,
  Radio,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  CAPITALIZE,
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import { MoreVert } from "@mui/icons-material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "application_no", label: "Application No" },
  { id: "child", label: "Child" },
  { id: "ad_paid", label: "Paid Status" },
  { id: "interview_status", label: "Interview Status", align: "center" },
  { id: "actions", label: "Action", align: "center" },
];

const PAYMENT_STATUS_LIST = [
  { label: "Paid", value: "1" },
  { label: "UnPaid", value: "0" },
];
const INTERVIEW_STATUS_LIST = [
  { label: "Cleared", value: "1" },
  { label: "Not Cleared", value: "0" },
];
const ADDED_TO_SCHOOL_LIST = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

export default function NewAdmissions() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    class: null,
    year: null,
    ad_paid: null,
    interview_status: null,
    added_to_school: null,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const dataSendToBackend = {
    search,
    class: filter?.class?.cg_name || "",
    year: Number(filter?.year?.ay_id) || "",
    ad_paid: filter?.ad_paid?.value || "",
    interview_status: filter?.interview_status?.value || "",
    added_to_school: filter?.added_to_school?.value || "",
  };

  // api to get new admissions list

  const {
    dataList: newAdmissionsList,
    dataCount: newAdmissionsCount,
    isLoading,
    isError,
  } = useGetApi({
    apiFunction: getNewAdmissions,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search, filter],
    debounceDelay: 500,
  });

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: Number(filter?.year?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [filter?.year],
  });

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  // open bulk action menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  // for searching
  const handleSearch = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleClick = (row) => {
    navigate("/students-management/new-admissions/new-admission-detail", {
      state: { row: row, allData: newAdmissionsList },
    });
  };

  // for filtering
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilter((prevState) => ({ ...prevState, [name]: value }));
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !newAdmissionsCount && !!search;

  return (
    <>
      <Card sx={{ p: 2, width: "100%" }}>
        <Typography>New Admissions</Typography>

        {/* Search and Filters */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
            my: 2,
          }}
        >
          <TextField
            value={search || ""}
            onChange={handleSearch}
            placeholder="Search by Name or Roll No..."
            size="small"
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={academicYearList || []}
            getOptionLabel={(option) => option?.ay_name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Year" size="small" />
            )}
            value={filter?.year || null}
            onChange={(_, newValue) =>
              handleChange({ target: { name: "year", value: newValue } })
            }
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={PAYMENT_STATUS_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Payment Status" size="small" />
            )}
            value={filter?.ad_paid || null}
            onChange={(_, newValue) =>
              handleChange({ target: { name: "ad_paid", value: newValue } })
            }
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={INTERVIEW_STATUS_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Interview Status" size="small" />
            )}
            value={filter?.interview_status || null}
            onChange={(_, newValue) =>
              handleChange({
                target: { name: "interview_status", value: newValue },
              })
            }
            sx={{ width: "200px" }}
          />
          <Autocomplete
            options={ADDED_TO_SCHOOL_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Added to School" size="small" />
            )}
            value={filter?.added_to_school || null}
            onChange={(_, newValue) =>
              handleChange({
                target: { name: "added_to_school", value: newValue },
              })
            }
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={classList || []}
            getOptionLabel={(option) => option?.cg_name || ""} // it is necessary for searching the options
            renderInput={(params) => (
              <TextField {...params} label="Class" size="small" />
            )}
            value={filter?.class || null}
            onChange={(_, newValue) =>
              handleChange({
                target: { name: "class", value: newValue },
              })
            }
            sx={{ minWidth: "200px" }}
          />
        </Box>

        {/* Table */}

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox />
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
                      {headCell?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {newAdmissionsList?.map((row, index) => {
                  const isAdmissionDone = row?.added_to_school === "1";
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={page * rowsPerPage + index}
                    >
                      <TableCell>{row?.sn || ""}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            cursor: "pointer",
                            color: "primary.main",
                            fontWeight: 500,
                          }}
                          onClick={() => handleClick(row)}
                        >
                          {row?.application_no || ""}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar
                            src={row?.child_photo_url}
                            alt="Child Pic"
                            sx={{ height: "70px", width: "70px" }}
                          />
                          <Box sx={{ whiteSpace: "nowrap" }}>
                            <Typography variant="subtitle2">
                              {row?.name || ""}
                            </Typography>
                            <Typography>
                              Gender: {CAPITALIZE(row?.gender) || ""}
                            </Typography>
                            <Typography>
                              DOB:{" "}
                              {row?.dob
                                ? dayjs(row?.dob).format("DD-MM-YYYY")
                                : null}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                              }}
                            >
                              <Typography>
                                Class: {row?.class || "N/A"}
                              </Typography>
                              <Box
                                sx={{
                                  py: "2px",
                                  px: 0.3,
                                  borderRadius: "5px",
                                  border: `2px solid ${
                                    isAdmissionDone
                                      ? theme.palette.success.main
                                      : theme.palette.error.main
                                  }`,
                                  color: isAdmissionDone
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Radio
                                  checked
                                  color={isAdmissionDone ? "success" : "error"}
                                  size="small"
                                  sx={{ padding: 0 }}
                                />
                                <Typography sx={{ fontSize: "10px" }}>
                                  Admission:{" "}
                                  {`${isAdmissionDone ? "Done" : "Pending"}`}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            borderRadius: "15px",
                            px: 1,
                            py: 0.5,
                            textAlign: "center",
                            background:
                              row?.ad_paid === "1"
                                ? theme.palette.success.main
                                : theme.palette.error.main,
                            color: "white",
                            maxWidth: "80px",
                          }}
                        >
                          {row?.ad_paid === "1" ? "Paid" : "Unpaid"}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          sx={{
                            color:
                              row?.interview_status === "1"
                                ? "success.main"
                                : "error.main",
                          }}
                        >
                          {row?.interview_status === "1"
                            ? "Cleared"
                            : "Not Cleared"}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, newAdmissionsCount)}
                />

                {notFound && <TableNoData query={search} />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        <TablePagination
          page={page}
          component="div"
          count={newAdmissionsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
