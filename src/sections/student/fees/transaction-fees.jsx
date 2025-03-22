import { useState } from "react";

import {
  Card,
  CardContent,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Box,
} from "@mui/material";

import {
  DEFAULT_LIMIT,
  emptyRows,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../utils/constants";
import { useGetApi } from "../../../hooks/useGetApi";
import TableEmptyRows from "../../../components/table/table-empty-rows";
import TableNoData from "../../../components/table/table-no-data";
import MessageBox from "../../../components/error/message-box";
import Loader from "../../../components/loader/loader";
import { getTransactions } from "../../../services/student/fees.service";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import TransactionFeesTableRow from "./transaction-fee-table-row";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "", label: "SN" },
  { id: "student_name", label: "Name" },
  { id: "txn_date", label: "Date" },
  { id: "txn_from", label: "From" },
  { id: "txn_to", label: "To" },
  { id: "narration", label: "Narration" },
  { id: "mode", label: "Mode" },
  { id: "amount", label: "Amount" },
];

export default function TransactionFees() {
  const { userInfo } = useAuth();
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  // api to get paid fees list

  const {
    dataList: transactionList,
    dataCount: transactionCount,
    isLoading,
    isError,
  } = useGetApi({
    apiFunction: getTransactions,
    body: {
      st_id: userInfo?.st_id,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
    dependencies: [page, rowsPerPage],
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

  // if no search result is found
  const notFound = !transactionCount;

  return (
    <>
      <Helmet>
        <title>Transactions | SAIFEE</title>
      </Helmet>

      {/* Table */}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox />
      ) : (
        <Card sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Box sx={{ mb: 2, fontSize: "20px" }}>
              Transactions - {userInfo?.name || ""}
            </Box>

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
                        {headCell?.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {transactionList?.map((row, index) => {
                    const rowIndex = page * rowsPerPage + index + 1;
                    return (
                      <TransactionFeesTableRow
                        key={row?.id}
                        row={row}
                        rowIndex={rowIndex}
                      />
                    );
                  })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, transactionCount)}
                  />

                  {notFound && <TableNoData />}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}

            <TablePagination
              page={page}
              component="div"
              count={transactionCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      )}
    </>
  );
}
