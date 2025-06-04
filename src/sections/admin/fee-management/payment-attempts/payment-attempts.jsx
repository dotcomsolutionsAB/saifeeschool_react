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
  Autocomplete,
  Box,
  Checkbox,
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
  getPaymentModes,
  paymentAttempts,
} from "../../../../services/admin/transactions.service";
import dayjs from "dayjs";
import { Helmet } from "react-helmet-async";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "SN", label: "SN" },
  { id: "Name", label: "Name" },
  { id: "Date", label: "Date" },
  { id: "Unique_Ref_No", label: "Ref No" },
  { id: "Txn_Id", label: "Txn ID" },
  { id: "Mode", label: "Mode" },
  { id: "Total_Amount", label: "Amount" },
  { id: "Status", label: "Status" },
];

const STATUS_LIST = [
  { label: "Success", value: "success" },
  { label: "Pending", value: "pending" },
];

export default function PaymentAttempts() {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState(null);
  const [mode, setMode] = useState(null);
  // const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [isExportLoading, setIsExportLoading] = useState(false);

  const dataSendToBackend = {
    search: search || "",
    status: status?.value || "",
    mode: mode || "",
  };
  // api to get students list

  const {
    dataList: paymentAttemptsList,
    dataCount: paymentAttemptsCount,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: paymentAttempts,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search, status, mode],
    debounceDelay: 500,
  });

  // api to get mode list

  const { dataList: modeList } = useGetApi({
    apiFunction: getPaymentModes,
  });

  // open bulk action menu

  // const handleMenuOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // function to export students data as pdf
  // const handleExport = async (exportType) => {
  //   handleMenuClose();
  //   setIsExportLoading(true);
  //   const response = await exportStudents({
  //     ...dataSendToBackend,
  //     type: exportType,
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
      const newSelecteds = paymentAttemptsList?.map((n) => n?.SN);
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

  // for filtering
  const handleChange = (field, value) => {
    switch (field) {
      case "status":
        setStatus(value);
        break;
      case "mode":
        setMode(value);
        break;
      default:
        break;
    }
    setPage(0); // Reset page to 0 whenever a filter is changed
  };

  // if no search result is found
  const notFound = !paymentAttemptsCount && !!search;

  return (
    <>
      <Helmet>
        <title>Payment Attempts | SAIFEE</title>
      </Helmet>

      <Card sx={{ p: 2, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography>Students Payment Attempts</Typography>
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
                onClick={() => handleExport("excel")}
                sx={{ color: "primary.main" }}
              >
                <Iconify icon="uiw:file-excel" sx={{ mr: 1 }} />
                Export Excel
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
            mt: 1,
            mb: 2,
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
            options={modeList || []}
            renderInput={(params) => (
              <TextField {...params} label="Select Mode" size="small" />
            )}
            value={mode || null}
            onChange={(_, newValue) => handleChange("mode", newValue)}
            sx={{ width: "200px" }}
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
                          paymentAttemptsList?.some(
                            (student) => student?.SN === SN
                          )
                        )?.length > 0 &&
                        selectedRows?.filter((SN) =>
                          paymentAttemptsList?.some(
                            (student) => student?.SN === SN
                          )
                        )?.length < paymentAttemptsList?.length
                      }
                      checked={
                        paymentAttemptsList?.length > 0 &&
                        selectedRows?.filter((SN) =>
                          paymentAttemptsList?.some(
                            (student) => student?.SN === SN
                          )
                        )?.length === paymentAttemptsList?.length
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
                {paymentAttemptsList?.map((row) => (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row?.id}
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
                      <Typography variant="subtitle2" noWrap>
                        {row?.Name || ""}
                      </Typography>
                      <Typography variant="subtitle2" noWrap>
                        {row?.["Roll No"] || ""}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {row?.Date
                        ? dayjs(row?.Date).format("DD-MM-YYYY HH:mm")
                        : "-"}
                    </TableCell>

                    <TableCell>{row?.Unique_Ref_No || ""}</TableCell>
                    <TableCell>{row?.Txn_Id || "-"}</TableCell>
                    <TableCell>{row?.Mode || ""}</TableCell>
                    <TableCell>{`₹ ${
                      FORMAT_INDIAN_CURRENCY(row?.Total_Amount) || "0"
                    }`}</TableCell>
                    <TableCell>{row?.Status || ""}</TableCell>
                  </TableRow>
                ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, paymentAttemptsCount)}
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
          count={paymentAttemptsCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
