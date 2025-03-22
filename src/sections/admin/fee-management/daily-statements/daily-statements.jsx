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
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import Loader from "../../../../components/loader/loader";
import MessageBox from "../../../../components/error/message-box";
import {
  getPaymentModes,
  getRecords,
} from "../../../../services/admin/transactions.service";
import { DatePicker } from "@mui/x-date-pickers";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "SN", label: "SN" },
  { id: "Name", label: "Name" },
  { id: "Date", label: "Date" },
  { id: "Unique_Ref_No", label: "Ref No" },
  { id: "Total_Amount", label: "Amount" },
  { id: "Mode", label: "Mode" },
  { id: "Status", label: "Status" },
];

export default function DailyStatements() {
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  const [mode, setMode] = useState(null);
  const [dueFrom, setDueFrom] = useState(null);
  const [dueTill, setDueTill] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const dataSendToBackend = {
    search: search || "",
    mode: mode || "",
    date_from: dueFrom || "",
    date_to: dueTill || "",
  };
  // api to get students list

  const {
    dataList: paymentAttemptsList,
    dataCount: paymentAttemptsCount,
    isLoading,
    isError,
    allResponse,
  } = useGetApi({
    apiFunction: getRecords,
    body: {
      ...dataSendToBackend,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search, mode, dueFrom, dueTill],
    debounceDelay: 500,
  });

  // api to get mode list

  const { dataList: modeList } = useGetApi({
    apiFunction: getPaymentModes,
  });

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
      case "mode":
        setMode(value);
        break;
      case "dueFrom":
        setDueFrom(value);
        break;
      case "dueTill":
        setDueTill(value);
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
        {/* Total Due */}
        <Button variant="outlined">
          Total Amount: ₹ {allResponse?.page_total_amount || "0"}/-
        </Button>
      </Box>

      <Card sx={{ p: 2, width: "100%" }}>
        <Typography>Daily Statments</Typography>

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
            options={modeList || []}
            renderInput={(params) => (
              <TextField {...params} label="Select Mode" size="small" />
            )}
            value={mode || null}
            onChange={(_, newValue) => handleChange("mode", newValue)}
            sx={{ width: "200px" }}
          />

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
                    </TableCell>

                    <TableCell>{row?.Date || ""}</TableCell>
                    <TableCell>{row?.Unique_Ref_No || ""}</TableCell>
                    <TableCell>{row?.Total_Amount || ""}</TableCell>
                    <TableCell>{row?.Mode || ""}</TableCell>
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
