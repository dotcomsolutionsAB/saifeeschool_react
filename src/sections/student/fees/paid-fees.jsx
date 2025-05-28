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
  FORMAT_INDIAN_CURRENCY,
  ROWS_PER_PAGE_OPTIONS,
} from "../../../utils/constants";
import { useGetApi } from "../../../hooks/useGetApi";
import TableEmptyRows from "../../../components/table/table-empty-rows";
import TableNoData from "../../../components/table/table-no-data";
import MessageBox from "../../../components/error/message-box";
import Loader from "../../../components/loader/loader";
import PaidFeesTableRow from "./paid-fees-table-row";
import { getPaidFees } from "../../../services/student/fees.service";
import useAuth from "../../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "fpp_name", label: "Fee" },
  { id: "fpp_amount", label: "Fee Amount" },
  { id: "fpp_due_date", label: "Due Date" },
  { id: "total_amount", label: "Total Amount" },
];

export default function PaidFees() {
  const { userInfo } = useAuth();
  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);

  // api to get paid fees list

  const {
    dataList: paidFeesList,
    dataCount: paidFeesCount,
    allResponse,
    isLoading,
    isError,
    errorMessage,
  } = useGetApi({
    apiFunction: getPaidFees,
    body: {
      st_id: userInfo?.st_id,
      ay_id: userInfo?.ay_id,
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
  const notFound = !paidFeesCount;

  return (
    <>
      <Helmet>
        <title>Paid Fees | SAIFEE</title>
      </Helmet>

      {/* Table */}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <Card sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Box sx={{ mb: 2, fontSize: "20px" }}>
              Paid Fees - {userInfo?.name || ""} | ₹
              {FORMAT_INDIAN_CURRENCY(allResponse?.total_paid) || "0"}
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
                  {paidFeesList?.map((row) => {
                    return <PaidFeesTableRow key={row?.id} row={row} />;
                  })}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, paidFeesCount)}
                  />

                  {notFound && <TableNoData />}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}

            <TablePagination
              page={page}
              component="div"
              count={paidFeesCount}
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
