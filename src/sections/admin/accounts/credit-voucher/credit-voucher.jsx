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
import CreateEditCreditVoucherModal from "./modals/create-edit-credit-voucher-modal";
import CreditVoucherTableRow from "./credit-voucher-table-row";
import { Helmet } from "react-helmet-async";
import { getCredit } from "../../../../services/admin/accounts.service";
import { TotalDebitedIcon } from "../../../../theme/overrides/CustomIcons";
import Iconify from "../../../../components/iconify/iconify";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "credit_no", label: "Credit No" },
  { id: "date", label: "Date" },
  { id: "amount", label: "Amount" },
  { id: "collected_from", label: "Collected From" },
  { id: "cheque_no", label: "Cheque No" },
  { id: "description", label: "Description" },
  { id: "actions", label: "Actions", align: "center" },
];

export default function CreditVoucher() {
  const theme = useTheme();
  const cardHeight = "200px";

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");
  const [creditVoucherCreateModalOpen, setCreditVoucherCreateModalOpen] =
    useState(false);

  // api to get credit list

  const {
    allResponse,
    dataList: creditList,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getCredit,
    // body: {
    //   search,
    //   offset: page * rowsPerPage,
    //   limit: rowsPerPage,
    // },
    // dependencies: [page, rowsPerPage, search],
    // debounceDelay: 500,
  });

  // add new credit modal handler

  const handleCreditVoucherCreateModalOpen = () => {
    setCreditVoucherCreateModalOpen(true);
  };

  const handleCreditVoucherCreateModalClose = () => {
    setCreditVoucherCreateModalOpen(false);
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
  const notFound = !creditList?.length && !!search;

  return (
    <>
      <Helmet>
        <title>Credit Voucher | SAIFEE</title>
      </Helmet>

      {!isLoading && !isError && (
        <Grid container spacing={2}>
          {/* Total Cash Card */}
          <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                  <Typography variant="h6" noWrap>
                    ₹ {FORMAT_INDIAN_CURRENCY(allResponse?.total_cash) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Total Cheque Card */}
          <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                  <Typography variant="h6" noWrap>
                    ₹ {FORMAT_INDIAN_CURRENCY(allResponse?.total_cheque) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Total Credited Card */}
          <Grid item xs={12} sm={6} lg={4} xl={3}>
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
                  aria-label="Total Credited indicator"
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
                    Total Credited
                  </Typography>
                  <Typography variant="h6" noWrap>
                    ₹{" "}
                    {FORMAT_INDIAN_CURRENCY(allResponse?.total_credited) || "0"}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card sx={{ my: 2, p: 2, width: "100%" }}>
        {/* Search and Add new credit voucher */}
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
            onClick={handleCreditVoucherCreateModalOpen}
          >
            + Add New Credit Voucher
          </Button>

          {/* Create Credit Voucher Modal */}
          <CreateEditCreditVoucherModal
            open={creditVoucherCreateModalOpen}
            onClose={handleCreditVoucherCreateModalClose}
            refetch={refetch}
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
                {creditList?.map((row, index) => {
                  return (
                    <CreditVoucherTableRow
                      key={row?.id}
                      index={index}
                      row={row}
                      refetch={refetch}
                    />
                  );
                })}

                {/* <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, creditList?.length)}
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
          count={creditList?.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Card>
    </>
  );
}
