import { useRef, useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  CircularProgress,
  Grid,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
} from "@mui/material";
import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import { useGetApi } from "../../../../hooks/useGetApi";
import TableEmptyRows from "../../../../components/table/table-empty-rows";
import TableNoData from "../../../../components/table/table-no-data";
import MessageBox from "../../../../components/error/message-box";
import Loader from "../../../../components/loader/loader";
import BanksTableRow from "./banks-table-row";
import { Helmet } from "react-helmet-async";
import {
  createBankTransaction,
  getBankTransactions,
  updateBankTransaction,
} from "../../../../services/admin/accounts.service";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "type", label: "Type" },
  { id: "date", label: "Date" },
  { id: "amount", label: "Amount" },
  { id: "comments", label: "Comments" },
  { id: "user", label: "User" },
  { id: "actions", label: "Actions", align: "center" },
];

export default function Banks() {
  const { logout } = useAuth();
  const topRef = useRef(null);

  const initialState = {
    date: dayjs().format("YYYY-MM-DD"),
    type: "",
    amount: 0,
    comments: "",
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [formData, setFormData] = useState(initialState);
  const [search, setSearch] = useState("");
  const [isExportLoading, setIsExportLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // api to get bank transaction list
  const {
    dataList: bankList,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getBankTransactions,
    // body: {
    //   search,
    //   offset: page * rowsPerPage,
    //   limit: rowsPerPage,
    // },
    // dependencies: [page, rowsPerPage, search],
    // debounceDelay: 500,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date"
        ? dayjs(value).format("YYYY-MM-DD")
        : type === "number"
        ? Number(value)
        : value;
    setFormData((preValue) => ({
      ...preValue,
      [name]: parsedValue,
    }));
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setLoading(true);
    if (formData?.id) {
      response = await updateBankTransaction(formData);
    } else {
      response = await createBankTransaction(formData);
    }
    setLoading(false);

    if (response?.code === 200) {
      setFormData(initialState);
      refetch();
      toast.success(response?.message || "Bank transaction added successfully");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  // function to export students data
  const handleExcelExport = async () => {
    setIsExportLoading(true);
    let response;
    // const response = await exportTCDetails({
    //   ...dataSendToBackend,
    //   type: "excel",
    // });
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

  const handleScrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
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

  // if no search result is found
  const notFound = !bankList?.length && !!search;

  return (
    <>
      <Helmet>
        <title>Bank Transactions | SAIFEE</title>
      </Helmet>

      <Card sx={{ mt: 1 }} ref={topRef}>
        <CardContent>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="h5">Bank Transactions</Typography>
            <Typography variant="subtitle1" sx={{ ml: "auto" }}>
              {formData?.id
                ? `Update Transaction - ${formData?.sn}`
                : "Add Transaction"}
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Transaction Type */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Autocomplete
                  options={["Deposit", "Withdrawal"]}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Select Transaction Type"
                      required
                    />
                  )}
                  value={formData?.type || ""}
                  onChange={(_, newValue) =>
                    handleChange({ target: { name: "type", value: newValue } })
                  }
                />
              </Grid>
              {/* Date */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DatePicker
                  name="date"
                  label="Date"
                  value={formData?.date ? dayjs(formData?.date) : null}
                  onChange={(newValue) =>
                    handleChange({
                      target: { type: "date", name: "date", value: newValue },
                    })
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      size: "small",
                    },
                  }}
                  disableFuture
                />
              </Grid>

              {/* Amount */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  type="number"
                  name="amount"
                  label="Amount"
                  required
                  fullWidth
                  size="small"
                  value={formData?.amount || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Comments */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  name="comments"
                  label="Comments"
                  required
                  fullWidth
                  size="small"
                  value={formData?.comments || ""}
                  onChange={handleChange}
                />
              </Grid>

              {/* Button */}
              <Grid item xs={12} sx={{ textAlign: "right" }}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ ml: 1 }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : formData?.id ? (
                    "Update"
                  ) : (
                    `Submit`
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mt: 4, mb: 2, p: 2, width: "100%" }}>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <MessageBox />
        ) : (
          <>
            {/* Search and Add new debit voucher */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 2,
                width: "100%",
              }}
            >
              {/* <TextField
          value={search || ""}
          onChange={handleSearch}
          placeholder="Search"
          size="small"
        /> */}

              {/* Export Excel */}
              <Button
                variant="contained"
                onClick={handleExcelExport}
                disabled={isExportLoading}
                sx={{
                  bgcolor: "success.main",
                  color: "success.contrastText",
                  ml: "auto",
                }}
              >
                {isExportLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  `Export Excel`
                )}
              </Button>
            </Box>
            {/* Table */}
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
                  {bankList?.map((row, index) => {
                    return (
                      <BanksTableRow
                        key={row?.id}
                        row={row}
                        index={index}
                        refetch={refetch}
                        setFormData={setFormData}
                        handleScrollToTop={handleScrollToTop}
                      />
                    );
                  })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, bankList?.length)}
                  />

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Pagination */}

        {/* <TablePagination
          page={page}
          component="div"
          count={bankList?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Card>
    </>
  );
}
