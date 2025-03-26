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
  exportStudents,
  getAllAcademicYears,
  getClasses,
} from "../../../../services/admin/students-management.service";
import useAuth from "../../../../hooks/useAuth";
import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import { emptyRows, ROWS_PER_PAGE_OPTIONS } from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import { DatePicker } from "@mui/x-date-pickers";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  ExpandLessRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Iconify from "../../../../components/iconify/iconify";
import UpgradeStudentModal from "./modals/upgrade-student-modal";
import ApplyFeePlanModal from "./modals/apply-fee-plan-modal";
import useStudent from "../../../../hooks/useStudent";

// ----------------------------------------------------------------------

const HEAD_LABEL = [
  // { id: "id", label: "ID" },
  { id: "st_first_name", label: "Name" },
  { id: "class_name", label: "Class" },
  { id: "st_roll_no", label: "Roll No" },
  { id: "st_gender", label: "Gender" },
  { id: "st_dob", label: "Date of Birth" },
  { id: "st_mobile", label: "Phone" },
];

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
  const {
    bohra,
    selectedOptions,
    gender,
    dobFrom,
    dobTo,
    academicYear,
    anchorEl,
    selectedRows,
    isExportLoading,
    page,
    rowsPerPage,
    search,
    setPage,
    setRowsPerPage,
    setSearch,
    setBohra,
    setCgId,
    setSelectedOptions,
    setGender,
    setDobFrom,
    setDobTo,
    setAcademicYear,
    setAnchorEl,
    setSelectedRows,
    setIsExportLoading,
    dataSendToBackend,
    studentsList,
    studentsCount,
    isLoading,
    isError,
    refetch,
  } = useStudent();

  const [upgradeStudentOpen, setUpgradeStudentOpen] = useState(false);
  const [applyFeePlanOpen, setApplyFeePlanOpen] = useState(false);

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: academicYear?.ay_id || userInfo?.ay_id,
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

  // upgrade student handler

  const handleUpgradeStudentOpen = () => {
    handleMenuClose();
    if (!selectedRows?.length) {
      toast.info("Select the students to upgrade");
      return;
    }
    setUpgradeStudentOpen(true);
  };

  const handleUpgradeStudentClose = () => {
    setUpgradeStudentOpen(false);
  };

  // apply fee plan handler

  const handleApplyFeePlanOpen = () => {
    handleMenuClose();
    if (!selectedRows?.length) {
      toast.info("Select the students to apply fee plan");
      return;
    }
    setApplyFeePlanOpen(true);
  };

  const handleApplyFeePlanClose = () => {
    setApplyFeePlanOpen(false);
  };

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = studentsList?.map((n) => n?.id);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selectedRows?.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selectedRows, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected?.concat(selectedRows?.slice(1));
    } else if (selectedIndex === selectedRows?.length - 1) {
      newSelected = newSelected?.concat(selectedRows?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected?.concat(
        selectedRows?.slice(0, selectedIndex),
        selectedRows?.slice(selectedIndex + 1)
      );
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
        {/* Add Student */}
        <Button variant="contained" onClick={handleAddStudent}>
          Add Student
        </Button>

        {/* Bulk Actions */}
        <Button
          variant="contained"
          onClick={handleMenuOpen}
          endIcon={anchorEl ? <ExpandLessRounded /> : <ExpandMoreRounded />}
          disabled={isExportLoading}
        >
          {isExportLoading ? <CircularProgress size={24} /> : `Bulk Actions`}
        </Button>

        {/* Menu  */}
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
          {/* export excel */}
          <MenuItem
            onClick={() => handleExport("excel")}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="uiw:file-excel" sx={{ mr: 1 }} />
            Export Excel
          </MenuItem>

          {/* export pdf */}
          <MenuItem
            onClick={() => handleExport("pdf")}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} />
            Export PDF
          </MenuItem>

          {/* upgrade student */}
          <MenuItem
            onClick={handleUpgradeStudentOpen}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="game-icons:team-upgrade" sx={{ mr: 1 }} />
            Upgrade Student
          </MenuItem>

          {/* apply fee plan */}
          <MenuItem
            onClick={handleApplyFeePlanOpen}
            sx={{ color: "primary.main" }}
          >
            <Iconify icon="ep:calendar" sx={{ mr: 1 }} />
            Apply Fee Plan
          </MenuItem>
        </Menu>

        {/*Upgrade Student Dialog */}
        <UpgradeStudentModal
          open={upgradeStudentOpen}
          onClose={handleUpgradeStudentClose}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          refetch={refetch}
        />

        {/*Apply Fee Plan Dialog */}
        <ApplyFeePlanModal
          open={applyFeePlanOpen}
          onClose={handleApplyFeePlanClose}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          refetch={refetch}
        />
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
            getOptionLabel={(option) => option?.cg_name || ""} // it is necessary for searching the options
            renderInput={(params) => (
              <TextField {...params} label="Class" size="small" />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option?.id}>
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
                    {/* <TableCell>{row?.id || ""}</TableCell> */}

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

                    <TableCell>{row?.class_name || ""}</TableCell>

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
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
