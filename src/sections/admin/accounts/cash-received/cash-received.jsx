import { useState } from "react";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
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
import CashReceivedTableRow from "./cash-received-table-row";
import { Helmet } from "react-helmet-async";
import { getCashReceived } from "../../../../services/admin/accounts.service";
import useAuth from "../../../../hooks/useAuth";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "sn", label: "SN" },
  { id: "name", label: "Name" },
  { id: "date", label: "Date" },
  { id: "type", label: "Type" },
  { id: "details", label: "Details" },
  { id: "amount", label: "Amount" },
  { id: "status", label: "Status" },
  { id: "", label: "Actions", align: "center" },
];

export default function CashReceived() {
  const { userInfo } = useAuth();
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  const [search, setSearch] = useState("");

  // api to get debit list

  const {
    dataList: cashReceivedList,
    dataCount,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getCashReceived,
    body: {
      search,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage, search],
    debounceDelay: 500,
  });

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
  const notFound = !dataCount && !!search;

  return (
    <>
      <Helmet>
        <title>Cash Received | SAIFEE</title>
      </Helmet>

      <Card sx={{ my: 2, p: 2, width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Details for AY {userInfo?.ay_name}
        </Typography>
        {/* Search and Add Cash Received*/}
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
          <TextField
            value={search || ""}
            onChange={handleSearch}
            placeholder="First Name/Last Name/Roll No/ITS"
            size="small"
            sx={{ width: "clamp(250px, 40%, 350px)" }}
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
                {cashReceivedList?.map((row, index) => {
                  return (
                    <CashReceivedTableRow
                      key={row?.id}
                      row={row}
                      index={index}
                      refetch={refetch}
                    />
                  );
                })}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataCount)}
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
          count={dataCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
