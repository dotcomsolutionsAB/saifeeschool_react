import { useEffect, useState } from "react";

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
  getAllAcademicYears,
  getClasses,
} from "../../../../services/admin/students-management.service";
import useAuth from "../../../../hooks/useAuth";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useGetApi } from "../../../../hooks/useGetApi";
import {
  DEFAULT_LIMIT,
  emptyRows,
  FORMAT_INDIAN_CURRENCY,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
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
import Iconify from "../../../../components/iconify/iconify";
import {
  exportFeesPDF,
  getAllFees,
  getOneTimeFees,
} from "../../../../services/admin/fees-management.service";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "SN", label: "SN" },
  { id: "Name", label: "Name" },
  { id: "Fee Name", label: "Fee" },
  { id: "Base Amount", label: "Fee Amount", align: "center" },
  { id: "Due Date", label: "Due Date", align: "center" },
  { id: "Total Amount", label: "Total Amount", align: "center" },
  { id: "Status", label: "Status", align: "center" },
];

const STATUS_LIST = [
  { label: "Paid", value: "paid" },
  { label: "UnPaid", value: "unpaid" },
];

const TYPE_LIST = [
  { label: "Monthly Fees", value: "monthly" },
  { label: "Admission Fees", value: "admission" },
  { label: "One-Time Fees", value: "one_time" },
  { label: "Recurring Fees", value: "recurring" },
];

export default function Fees() {
  const location = useLocation();
  const { userInfo, logout } = useAuth();

  const filter = location?.state?.query_key_unpaid;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const [cgId, setCgId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]); // to select multiple checkboxes in class field
  const [type, setType] = useState(null);
  const [dueFrom, setDueFrom] = useState(null);
  const [dueTill, setDueTill] = useState(null);
  const [academicYear, setAcademicYear] = useState({
    ay_id: userInfo?.ay_id,
    ay_name: userInfo?.ay_name,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [oneTimeFees, setOneTimeFees] = useState(null);
  const [isFilterInitialized, setIsFilterInitialized] = useState(!filter);

  const dataSendToBackend = {
    ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    search: search || "",
    status: status?.value || "",
    cg_id: cgId || "",
    type: type?.value || "",
    fpp_id: oneTimeFees?.fpp_id?.toString() || "",
    date_from: dueFrom ? dayjs(dueFrom).format("YYYY-MM-DD") : null,
    date_to: dueTill ? dayjs(dueTill).format("YYYY-MM-DD") : null,
  };

  // api to get students list

  const {
    dataList: feesList,
    dataCount: feesCount,
    allResponse,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getAllFees,
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
      status,
      cgId,
      type,
      oneTimeFees,
      dueFrom,
      dueTill,
    ],
    debounceDelay: 500,
    skip: !isFilterInitialized,
  });

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
    body: {
      ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [academicYear],
  });

  // api to get academicYearList
  const { dataList: academicYearList } = useGetApi({
    apiFunction: getAllAcademicYears,
  });

  // api to get oneTimeFees
  const { dataList: oneTimeFeesList } = useGetApi({
    apiFunction: getOneTimeFees,
    body: {
      ay_id: Number(academicYear?.ay_id) || userInfo?.ay_id,
    },
    dependencies: [academicYear],
  });

  // open bulk action menu

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // function to export students data as pdf and excel
  const handleExport = async () => {
    handleMenuClose();
    setIsExportLoading(true);
    const response = await exportFeesPDF(dataSendToBackend);
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
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = feesList?.map((n) => n?.SN);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (SN) => {
    const selectedIndex = selectedRows?.indexOf(SN);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selectedRows, SN);
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
      case "status":
        setStatus(value);
        break;
      case "cgId":
        setCgId(value);
        break;
      case "type":
        setType(value);
        break;
      case "dueFrom":
        setDueFrom(value);
        break;
      case "dueTill":
        setDueTill(value);
        break;
      case "academicYear":
        setAcademicYear(value);
        setSelectedOptions([]); // Reset selected options when academic year changes
        setCgId(null); // Reset class group ID when academic year changes
        setOneTimeFees(null); // Reset one-time fees when academic year changes
        break;
      case "oneTimeFees":
        setOneTimeFees(value);
        break;
      default:
        break;
    }
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !feesCount && !!search;

  useEffect(() => {
    if (filter && filter?.status) {
      setStatus(
        filter?.status === "paid"
          ? STATUS_LIST[0]
          : filter?.status === "unpaid"
          ? STATUS_LIST[1]
          : null
      );
      setType(
        filter?.type === "monthly"
          ? TYPE_LIST[0]
          : filter?.type === "admission"
          ? TYPE_LIST[1]
          : filter?.type === "one_time"
          ? TYPE_LIST[2]
          : filter?.type === "recurring"
          ? TYPE_LIST[3]
          : null
      );
      setAcademicYear({
        ay_id: filter?.year,
        ay_name: filter?.ay_name || "",
      });
      setDueFrom(filter?.date_from ? dayjs(filter?.date_from) : null);
      setDueTill(filter?.date_to ? dayjs(filter?.date_to) : null);
    }
    setIsFilterInitialized(true);
  }, [filter]);
  return (
    <>
      <Helmet>
        <title>Fees | SAIFEE</title>
      </Helmet>

      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 1,
            width: "100%",
          }}
        >
          <Typography>Fees</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 1,
              flex: 1,
            }}
          >
            {/* Total Paid */}
            <Button variant="outlined">
              Total Paid:₹{" "}
              {FORMAT_INDIAN_CURRENCY(allResponse?.page_total_paid) || "0"}/-
            </Button>
            {/* Total Due */}
            <Button variant="outlined">
              Total Due: ₹{" "}
              {FORMAT_INDIAN_CURRENCY(allResponse?.page_total_due) || "0"}/-
            </Button>

            {/* Bulk Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                onClick={handleMenuOpen}
                endIcon={
                  anchorEl ? <ExpandLessRounded /> : <ExpandMoreRounded />
                }
                disabled={isExportLoading}
              >
                {isExportLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  `Bulk Actions`
                )}
              </Button>

              {/* Menu  */}
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ color: "primary.main" }}
              >
                {/* export excel */}
                {/* <MenuItem
                  onClick={() => handleExport("excel")}
                  sx={{ color: "primary.main" }}
                >
                  <Iconify icon="uiw:file-excel" sx={{ mr: 1 }} />
                  Export Excel
                </MenuItem> */}

                {/* export pdf */}
                <MenuItem onClick={handleExport} sx={{ color: "primary.main" }}>
                  <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} />
                  Export PDF
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>

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
            value={academicYear || null}
            onChange={(_, newValue) => handleChange("academicYear", newValue)}
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={STATUS_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Status" size="small" />
            )}
            value={status || null}
            onChange={(_, newValue) => handleChange("status", newValue)}
            sx={{ width: "200px" }}
          />

          <Autocomplete
            options={TYPE_LIST || []}
            getOptionLabel={(option) => option?.label || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Type" size="small" />
            )}
            value={type || null}
            onChange={(_, newValue) => handleChange("type", newValue)}
            sx={{ width: "200px" }}
          />
          {type?.value === "one_time" && (
            <Autocomplete
              options={oneTimeFeesList || []} // later add list from apis
              getOptionLabel={(option) => option?.fp_name || ""}
              renderInput={(params) => (
                <TextField {...params} label="One Time Fees For" size="small" />
              )}
              value={oneTimeFees || null}
              onChange={(_, newValue) => handleChange("oneTimeFees", newValue)}
              sx={{ width: "200px" }}
            />
          )}
          <DatePicker
            label="Due From"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dueFrom || null}
            onChange={(newDate) => handleChange("dueFrom", newDate)}
          />
          <DatePicker
            label="Due Till"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dueTill || null}
            onChange={(newDate) => handleChange("dueTill", newDate)}
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
          <MessageBox errorMessage={errorMessage} />
        ) : (
          <TableContainer sx={{ overflowY: "unset" }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedRows?.filter((SN) =>
                          feesList?.some((student) => student?.SN === SN)
                        )?.length > 0 &&
                        selectedRows?.filter((SN) =>
                          feesList?.some((student) => student?.SN === SN)
                        )?.length < feesList?.length
                      }
                      checked={
                        feesList?.length > 0 &&
                        selectedRows?.filter((SN) =>
                          feesList?.some((student) => student?.SN === SN)
                        )?.length === feesList?.length
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
                      {headCell?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {feesList?.map((row) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row?.SN}
                    role="checkbox"
                    selected={selectedRows?.indexOf(row?.SN) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        disableRipple
                        checked={selectedRows?.indexOf(row?.SN) !== -1}
                        onChange={() => handleClick(row?.SN)}
                      />
                    </TableCell>
                    <TableCell>{row?.SN || ""}</TableCell>

                    <TableCell sx={{ cursor: "pointer" }}>
                      <Typography variant="subtitle2">
                        {row?.Name || ""}
                      </Typography>
                      <Typography sx={{ mt: 0.5 }}>
                        {row?.["Class Name"] || ""}
                      </Typography>
                      <Typography>{row?.["Roll No"] || ""}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography>{row?.["Fee Name"] || ""} </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box>
                        <Typography sx={{ textAlign: "center" }}>
                          {`₹ ${
                            FORMAT_INDIAN_CURRENCY(row["Base Amount"]) || "0"
                          }`}
                        </Typography>
                        {Number(row["Late Fee"]) > 0 && (
                          <Typography
                            sx={{ color: "error.main", textAlign: "center" }}
                          >
                            {`₹ ${
                              FORMAT_INDIAN_CURRENCY(row["Late Fee"]) || "0"
                            }`}
                          </Typography>
                        )}
                        {Number(row["Concession"]) > 0 && (
                          <Typography
                            sx={{ color: "success.main", textAlign: "center" }}
                          >
                            {`₹ ${
                              FORMAT_INDIAN_CURRENCY(row["Concession"]) || "0"
                            }`}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <Typography noWrap>
                        {row["Due Date"]
                          ? dayjs(row["Due Date"]).format("DD-MM-YYYY")
                          : "-"}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>{row["Late Fee"] || ""}</TableCell> */}
                    <TableCell align="center">
                      {`₹ ${
                        FORMAT_INDIAN_CURRENCY(row["Total Amount"]) || "0"
                      }`}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          borderRadius: "15px",
                          px: 1,
                          py: 0.5,
                          // width: "80px",
                          textAlign: "center",
                          background:
                            row?.Status === "Paid" ? "#28A745" : "#D60A0B",
                          color: "white",
                        }}
                      >
                        {row?.Status || ""}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, feesCount)}
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
          count={feesCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
