import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import TableNoData from "../../../components/table/table-no-data";
import TableEmptyRows from "../../../components/table/table-empty-rows";

import {
  exportStudents,
  getAllAcademicYears,
  getAllClasses,
  getAllStudents,
} from "../../../services/students-management.service";
import useAuth from "../../../hooks/useAuth";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  lighten,
  Menu,
  MenuItem,
  Stack,
  styled,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useGetApi } from "../../../hooks/useGetApi";
import { DEFAULT_LIMIT, emptyRows } from "../../../utils/constants";
import Loader from "../../../components/loader/loader";
import MessageBox from "../../../components/error/message-box";
import { DatePicker } from "@mui/x-date-pickers";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  ExpandLessRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Iconify from "../../../components/iconify/iconify";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "id", label: "ID" },
  { id: "st_first_name", label: "Name" },
  { id: "st_roll_no", label: "Roll No" },
  { id: "st_gender", label: "Gender" },
  { id: "st_dob", label: "Date of Birth" },
  { id: "st_mobile", label: "Phone" },
];

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor: lighten(theme.palette.primary.light, 0.85),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const BOHRA_LIST = [
  { label: "Bohra", value: "1" },
  { label: "Non Bohra", value: "0" },
];

const GENDER_LIST = [
  { label: "Male", value: "M" },
  { label: "Female", value: "F" },
];

export default function Students() {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [bohra, setBohra] = useState(null);
  const [cgId, setCgId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]); // to select multiple checkboxes in class field
  const [gender, setGender] = useState(null);
  const [dobFrom, setDobFrom] = useState(null);
  const [dobTo, setDobTo] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendToBackend = {
    ay_id: academicYear?.id || userInfo?.ay_id,
    search: search || "",
    bohra: bohra?.value || "",
    cg_id: cgId || "",
    gender: gender?.value || "",
    dob_from: dobFrom || "",
    dob_to: dobTo || "",
  };

  // api to get students list

  const {
    dataList: studentsList,
    dataCount: studentsCount,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getAllStudents,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [
      academicYear,
      page,
      rowsPerPage,
      search,
      bohra,
      cgId,
      gender,
      dobFrom,
      dobTo,
    ],
    debounceDelay: 500,
  });

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getAllClasses,
    body: {
      ay_id: academicYear?.id || userInfo?.ay_id,
    },
    dependencies: [academicYear],
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

  // upgrade student handler

  const handleUpgradeStudent = () => {
    handleMenuClose();
  };

  // function to export students data as pdf
  const handleExport = async (type) => {
    handleMenuClose();
    setIsExportLoading(true);
    const response = await exportStudents({
      ...dataSendToBackend,
      type: type,
    });
    setIsExportLoading(false);

    if (response?.code === 200) {
      const link = document.createElement("a");
      link.href = response?.data?.file_url || "";
      link.target = "_blank"; // Open in a new tab
      link.rel = "noopener noreferrer"; // Add security attributes

      // Append the link to the document and trigger the download
      document.body.appendChild(link);
      link.click();

      // Remove the link after triggering the download
      document.body.removeChild(link);

      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleAppyFeePlan = async () => {};

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // Select only rows visible on the current page
      const newSelecteds = studentsList?.map((student) => student?.id);
      setSelectedRows((prevSelected) => [
        ...prevSelected.filter((id) => !newSelecteds?.includes(id)), // Avoid duplicates
        ...newSelecteds,
      ]);
    } else {
      // Deselect only rows visible on the current page
      const newSelecteds = studentsList?.map((student) => student?.id);
      setSelectedRows((prevSelected) =>
        prevSelected?.filter((id) => !newSelecteds?.includes(id))
      );
    }
  };

  const handleClick = (id) => {
    const selectedIndex = selectedRows?.indexOf(id);
    let newSelected = [...selectedRows];

    if (selectedIndex === -1) {
      // Add the new ID to the selected rows
      newSelected?.push(id);
    } else {
      // Remove the ID from the selected rows
      newSelected?.splice(selectedIndex, 1);
    }

    setSelectedRows(newSelected);
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

  // for multiple checkbox selection

  const handleSelectionChange = (event, newValues) => {
    setSelectedOptions(newValues);
    const ids = newValues?.map((option) => option?.id)?.join(",");
    handleChange("cgId", ids);
  };

  // for filtering
  const handleChange = (field, value) => {
    switch (field) {
      case "bohra":
        setBohra(value);
        break;
      case "cgId":
        setCgId(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "dobFrom":
        setDobFrom(value);
        break;
      case "dobTo":
        setDobTo(value);
        break;
      case "academicYear":
        setAcademicYear(value);
        break;
      default:
        break;
    }
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !studentsCount && !!search;

  const handleAddStudent = () => {
    navigate("/students-management/students/add-student");
  };

  // on row click
  const handleRowClick = (row) => {
    navigate("/students-management/students/student-detail", { state: row });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: 1,
          mb: 1,
          width: "100%",
        }}
      >
        <Button variant="contained" onClick={handleAddStudent}>
          Add Student
        </Button>
        <Button
          variant="contained"
          onClick={handleMenuOpen}
          endIcon={anchorEl ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          disabled={isExportLoading}
        >
          {isExportLoading ? <CircularProgress size={24} /> : `Bulk Actions`}
        </Button>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ color: "primary.main" }}
        >
          <MenuItem
            onClick={() => handleExport("excel")}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="uiw:file-excel" sx={{ mr: 1 }} />
            Export Excel
          </MenuItem>
          <MenuItem
            onClick={() => handleExport("pdf")}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} />
            Export PDF
          </MenuItem>
          <MenuItem
            onClick={handleUpgradeStudent}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="game-icons:team-upgrade" sx={{ mr: 1 }} />
            Upgrade Student
          </MenuItem>
          <MenuItem onClick={handleAppyFeePlan} sx={{ color: "primary.main" }}>
            <Iconify icon="ep:calendar" sx={{ mr: 1 }} />
            Apply Fee Plan
          </MenuItem>
        </Menu>
      </Box>

      <Card sx={{ p: 2, width: "100%" }}>
        <Typography>All Students Data</Typography>

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
            options={BOHRA_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Bohra/Non-Bohra" size="small" />
            )}
            value={bohra || null}
            onChange={(_, newValue) => handleChange("bohra", newValue)}
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={GENDER_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Gender" size="small" />
            )}
            value={gender || null}
            onChange={(_, newValue) => handleChange("gender", newValue)}
            sx={{ width: "200px" }}
          />

          <DatePicker
            label="DOB From"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dobFrom || null}
            onChange={(newDate) => handleChange("dobFrom", newDate)}
          />
          <DatePicker
            label="DOB To"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dobTo || null}
            onChange={(newDate) => handleChange("dobTo", newDate)}
          />

          <Autocomplete
            options={academicYearList || []}
            getOptionLabel={(option) => option?.ay_name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Year" size="small" />
            )}
            value={academicYear || null}
            onChange={(_, newValue) => handleChange("academicYear", newValue)}
            sx={{ width: "200px" }}
          />

          <Autocomplete
            multiple
            disableCloseOnSelect
            limitTags={1}
            options={classList || []}
            renderInput={(params) => (
              <TextField {...params} label="Class" size="small" />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  size="small"
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBox fontSize="small" />}
                  checked={selected}
                  sx={{ mr: 1 }}
                />
                {option?.cg_name || ""}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected?.map((option, index) => (
                <Chip
                  label={option?.cg_name}
                  size="small"
                  {...getTagProps({ index })}
                  key={option?.id}
                />
              ))
            }
            value={selectedOptions || []}
            onChange={handleSelectionChange}
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows?.filter((id) =>
                          studentsList?.some((student) => student?.id === id)
                        )?.length > 0 &&
                        selectedRows?.filter((id) =>
                          studentsList?.some((student) => student?.id === id)
                        )?.length < studentsList?.length
                      }
                      checked={
                        studentsList?.length > 0 &&
                        selectedRows?.filter((id) =>
                          studentsList?.some((student) => student?.id === id)
                        )?.length === studentsList?.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
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
                {studentsList?.map((row) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row?.id}
                    role="checkbox"
                    selected={selectedRows?.indexOf(row?.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        disableRipple
                        checked={selectedRows?.indexOf(row?.id) !== -1}
                        onChange={() => handleClick(row?.id)}
                      />
                    </TableCell>
                    <TableCell>{row?.id || ""}</TableCell>

                    <TableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleRowClick(row)}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          alt={`${row?.st_first_name || ""} ${
                            row?.st_last_name || ""
                          }`}
                          src={row?.photo}
                        />
                        <Typography variant="subtitle2" noWrap>
                          {`${row?.st_first_name || ""} ${
                            row?.st_last_name || ""
                          }`}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{row?.st_roll_no || ""}</TableCell>

                    <TableCell>{row?.st_gender || ""}</TableCell>

                    <TableCell>{row?.st_dob || ""}</TableCell>
                    <TableCell>{row?.st_mobile || ""}</TableCell>
                  </TableRow>
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, studentsCount)}
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
          count={studentsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
