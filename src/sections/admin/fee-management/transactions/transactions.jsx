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
} from "../../../../services/admin/students-management.service";
import useAuth from "../../../../hooks/useAuth";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
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
  FORMAT_INDIAN_CURRENCY,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  // ExpandLessRounded,
  // ExpandMoreRounded,
} from "@mui/icons-material";
// import { toast } from "react-toastify";
// import Iconify from "../../../../components/iconify/iconify";
import { getAllTransactions } from "../../../../services/admin/transactions.service";
import dayjs from "dayjs";
// import { exportTransactions } from "../../../../services/admin/fees-management.service";
import { DatePicker } from "@mui/x-date-pickers";
import { Helmet } from "react-helmet-async";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "st_roll_no", label: "Roll No" },
  { id: "student_name", label: "Name" },
  { id: "txn_date", label: "Date" },
  { id: "txn_from", label: "From" },
  { id: "txn_to", label: "To" },
  { id: "narration", label: "Narration" },
  { id: "mode", label: "Mode" },
  { id: "amount", label: "Amount" },
];

export default function Transactions() {
  const { userInfo } = useAuth();

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [cgId, setCgId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]); // to select multiple checkboxes in class field
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [academicYear, setAcademicYear] = useState({
    ay_id: userInfo?.ay_id,
    ay_name: userInfo?.ay_name,
  });
  // const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendToBackend = {
    ay_id: academicYear?.id || userInfo?.ay_id,
    search: search || "",
    cg_id: cgId || "",
    date_from: dateFrom || "",
    date_to: dateTo || "",
  };

  // api to get students list

  const {
    dataList: transactionsList,
    dataCount: transactionsCount,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getAllTransactions,
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
      cgId,
      dateFrom,
      dateTo,
    ],
    debounceDelay: 500,
  });

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getClasses,
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

  // const handleMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // function to export students data as pdf
  // const handleExport = async () => {
  //   handleMenuClose();
  //   setIsExportLoading(true);
  //   const response = await exportTransactions({
  //     cg_id: dataSendToBackend?.cg_id,
  //     date_from: dataSendToBackend?.date_from,
  //     date_to: dataSendToBackend?.date_to,
  //     search: dataSendToBackend?.search,
  //     mode: "",
  //   });
  //   setIsExportLoading(false);

  //   if (response?.code === 200) {
  //     const link = document.createElement("a");
  //     link.href = response?.data?.file_url || "";
  //     link.target = "_blank"; // Open in a new tab
  //     link.rel = "noopener noreferrer"; // Add security attributes

  //     // Append the link to the document and trigger the download
  //     document.body.appendChild(link);
  //     link.click();

  //     // Remove the link after triggering the download
  //     document.body.removeChild(link);

  //     toast.success(response?.message || "File downloaded successfully!");
  //   } else if (response?.code === 401) {
  //     logout(response);
  //     // toast.error(response?.message || "Unauthorized");
  //   } else {
  //     toast.error(response?.message || "Some error occurred.");
  //   }
  // };

  // select all
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = transactionsList?.map((n) => n?.st_roll_no);
      setSelectedRows(newSelecteds);
      return;
    }
    setSelectedRows([]);
  };

  const handleClick = (st_roll_no) => {
    const selectedIndex = selectedRows?.indexOf(st_roll_no);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected?.concat(selectedRows, st_roll_no);
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
      case "cgId":
        setCgId(value);
        break;
      case "date_from":
        setDateFrom(value);
        break;
      case "date_to":
        setDateTo(value);
        break;
      case "academicYear":
        setAcademicYear(value);
        setSelectedOptions([]);
        setCgId(null);
        break;
      default:
        break;
    }
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !transactionsCount && !!search;

  return (
    <>
      <Helmet>
        <title>Transactions | SAIFEE</title>
      </Helmet>

      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1,
          }}
        >
          <Typography>Students Transactions</Typography>
          {/* <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 1,
            }}
          >
        
            <Button
              variant="contained"
              onClick={handleMenuOpen}
              endIcon={anchorEl ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              disabled={isExportLoading}
            >
              {isExportLoading ? (
                <CircularProgress size={24} />
              ) : (
                `Bulk Actions`
              )}
            </Button>

    
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
   
              <MenuItem
                onClick={() => handleExport("pdf")}
                sx={{ color: "primary.main" }}
              >
                <Iconify icon="uiw:file-pdf" sx={{ mr: 1 }} />
                Export PDF
              </MenuItem>
            </Menu>
          </Box> */}
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

          <DatePicker
            label="Date From"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dateFrom || null}
            onChange={(newDate) => handleChange("date_from", newDate)}
          />
          <DatePicker
            label="Date To"
            slotProps={{
              textField: {
                size: "small",
                sx: { width: "200px" },
              },
            }}
            disableFuture
            value={dateTo || null}
            onChange={(newDate) => handleChange("date_to", newDate)}
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
                        selectedRows?.filter((st_roll_no) =>
                          transactionsList?.some(
                            (student) => student?.st_roll_no === st_roll_no
                          )
                        )?.length > 0 &&
                        selectedRows?.filter((st_roll_no) =>
                          transactionsList?.some(
                            (student) => student?.st_roll_no === st_roll_no
                          )
                        )?.length < transactionsList?.length
                      }
                      checked={
                        transactionsList?.length > 0 &&
                        selectedRows?.filter((st_roll_no) =>
                          transactionsList?.some(
                            (student) => student?.st_roll_no === st_roll_no
                          )
                        )?.length === transactionsList?.length
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
                {transactionsList?.map((row) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row?.st_roll_no}
                    role="checkbox"
                    selected={selectedRows?.indexOf(row?.st_roll_no) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        disableRipple
                        checked={selectedRows?.indexOf(row?.st_roll_no) !== -1}
                        onChange={() => handleClick(row?.st_roll_no)}
                      />
                    </TableCell>
                    <TableCell>{row?.st_roll_no || ""}</TableCell>

                    <TableCell sx={{ cursor: "pointer" }}>
                      <Typography variant="subtitle2" noWrap>
                        {row?.student_name || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {row?.txn_date
                        ? dayjs(row?.txn_date).format("DD-MM-YYYY")
                        : "-"}
                    </TableCell>

                    <TableCell>{row?.txn_from || ""}</TableCell>

                    <TableCell>{row?.txn_to || ""}</TableCell>
                    <TableCell>{row?.narration || ""}</TableCell>
                    <TableCell>{row?.mode || ""}</TableCell>
                    <TableCell>{`₹ ${
                      FORMAT_INDIAN_CURRENCY(row?.amount) || "0"
                    }`}</TableCell>
                  </TableRow>
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, transactionsCount)}
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
          count={transactionsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
