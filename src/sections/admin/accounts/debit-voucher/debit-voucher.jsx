import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  useTheme,
} from "@mui/material";
import {
  DEFAULT_LIMIT,
  emptyRows,
  FORMAT_INDIAN_CURRENCY,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../../utils/constants";
import { useGetApi } from "../../../../hooks/useGetApi";
import TableEmptyRows from "../../../../components/table/table-empty-rows";
import TableNoData from "../../../../components/table/table-no-data";
import MessageBox from "../../../../components/error/message-box";
import Loader from "../../../../components/loader/loader";
import CreateEditDebitVoucherModal from "./modals/create-edit-debit-voucher-modal";
import DebitVoucherTableRow from "./debit-voucher-table-row";
import { Helmet } from "react-helmet-async";
import { getDebit } from "../../../../services/admin/accounts.service";
import { TotalDebitedIcon } from "../../../../theme/overrides/CustomIcons";
import Iconify from "../../../../components/iconify/iconify";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "expense_no", label: "Expense No" },
  { id: "date", label: "Date" },
  { id: "amount", label: "Amount" },
  { id: "paid_to", label: "Paid To" },
  { id: "cheque_no", label: "Cheque No" },
  { id: "description", label: "Description" },
  { id: "actions", label: "Actions", align: "center" },
];

export default function DebitVoucher() {
  const theme = useTheme();
  const cardHeight = "200px";

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");
  const [debitVoucherCreateModalOpen, setDebitVoucherCreateModalOpen] =
    useState(false);

  // api to get debit list

  const {
    allResponse,
    dataList: debitList,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getDebit,
    // body: {
    //   search,
    //   offset: page * rowsPerPage,
    //   limit: rowsPerPage,
    // },
    // dependencies: [page, rowsPerPage, search],
    // debounceDelay: 500,
  });

  // add new debit modal handler

  const handleDebitVoucherCreateModalOpen = () => {
    setDebitVoucherCreateModalOpen(true);
  };

  const handleDebitVoucherCreateModalClose = () => {
    setDebitVoucherCreateModalOpen(false);
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
  const notFound = !debitList?.length && !!search;

  return (
    <>
      <Helmet>
        <title>Debit Voucher | SAIFEE</title>
      </Helmet>

      {!isLoading && !isError && (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Total Cash Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={10}
              sx={{
                height: `calc(${cardHeight} / 2 - 8px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: { xs: "80%", md: "100%", lg: "90%", xl: "80%" },
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "primary.lightHover",
                    color: "primary.main",
                    width: 60,
                    height: 60,
                  }}
                  disableRipple
                  aria-label="Total Cash warning"
                >
                  <Iconify icon="et:wallet" width={30} />
                </IconButton>
                <Divider
                  orientation="vertical"
                  sx={{
                    height: "40%",
                    width: 2,
                    bgcolor: "error.main",
                  }}
                />
                <Box>
                  <Typography sx={{ color: "text.disabled", fontSize: 14 }}>
                    Total Cash
                  </Typography>
                  <Typography variant="h6">
                    ₹ {FORMAT_INDIAN_CURRENCY(allResponse?.total) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Total Cheque Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={10}
              sx={{
                height: `calc(${cardHeight} / 2 - 8px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: { xs: "80%", md: "100%", lg: "90%", xl: "80%" },
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "primary.lightHover",
                    color: "primary.main",
                    width: 60,
                    height: 60,
                  }}
                  disableRipple
                  aria-label="Total Cheque indicator"
                >
                  <Iconify icon="teenyicons:wallet-outline" width={30} />
                </IconButton>
                <Divider
                  orientation="vertical"
                  sx={{
                    height: "40%",
                    width: 2,
                    bgcolor: "error.main",
                  }}
                />
                <Box>
                  <Typography sx={{ color: "text.disabled", fontSize: 14 }}>
                    Total Cheque
                  </Typography>
                  <Typography variant="h6">
                    ₹{" "}
                    {FORMAT_INDIAN_CURRENCY(
                      allResponse?.current_month_unpaid_amount
                    ) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Total Debited Card */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={10}
              sx={{
                height: `calc(${cardHeight} / 2 - 8px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: { xs: "80%", md: "100%", lg: "90%", xl: "80%" },
                }}
              >
                <IconButton
                  sx={{
                    bgcolor: "primary.lightHover",
                    color: "primary.main",
                    width: 60,
                    height: 60,
                  }}
                  disableRipple
                  aria-label="Total Debited indicator"
                >
                  <TotalDebitedIcon
                    sx={{
                      fontSize: 30,
                      color: "transparent",
                    }}
                    strokecolor={theme.palette.primary.main}
                  />
                </IconButton>
                <Divider
                  orientation="vertical"
                  sx={{
                    height: "40%",
                    width: 2,
                    bgcolor: "error.main",
                  }}
                />
                <Box>
                  <Typography sx={{ color: "text.disabled", fontSize: 14 }}>
                    Total Debited
                  </Typography>
                  <Typography variant="h6">
                    ₹{" "}
                    {FORMAT_INDIAN_CURRENCY(
                      allResponse?.current_month_unpaid_amount
                    ) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card sx={{ mt: 4, mb: 2, p: 2, width: "100%" }}>
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
          <Button
            variant="contained"
            sx={{ ml: "auto" }}
            onClick={handleDebitVoucherCreateModalOpen}
          >
            + Add New Debit Voucher
          </Button>

          {/* Create Debit Voucher Modal */}
          <CreateEditDebitVoucherModal
            open={debitVoucherCreateModalOpen}
            onClose={handleDebitVoucherCreateModalClose}
            refetch={refetch}
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
                      <TableSortLabel hideSortIcon>
                        {headCell?.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {debitList?.map((row, index) => {
                  return (
                    <DebitVoucherTableRow
                      key={row?.id}
                      row={row}
                      index={index}
                      refetch={refetch}
                    />
                  );
                })}

                {/* <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, debitList?.length)}
                /> */}

                {notFound && <TableNoData query={search} />}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}

        {/* <TablePagination
          page={page}
          component="div"
          count={debitList?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Card>
    </>
  );
}
