import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TableCell,
  TableHead,
  TableRow,
  Typography,
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
import PendingFeesTableRow from "./pending-fees-table-row";
import useAuth from "../../../hooks/useAuth";
import {
  getPendingFees,
  payFees,
} from "../../../services/student/fees.service";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import DisclaimerDialog from "../modals/disclaimer-dialog";
// ----------------------------------------------------------------------

const HEAD_LABEL = [
  { id: "fpp_name", label: "Fee" },
  { id: "fpp_amount", label: "Fee Amount" },
  { id: "fpp_due_date", label: "Due Date" },
  { id: "total_amount", label: "Total Amount" },
];

export default function PendingFees() {
  const { userInfo, logout } = useAuth();
  // const [page, setPage] = useState(0);

  // const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_LIMIT);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // api to get paid fees list

  const {
    dataList: pendingFeesList,
    // dataCount: pendingFeesCount,
    allResponse,
    isLoading,
    isError,
    refetch,
  } = useGetApi({
    apiFunction: getPendingFees,
    body: {
      st_id: userInfo?.st_id,
      offset: 0,
      limit: 100,
    },
    // dependencies: [page, rowsPerPage],
  });
  // select all
  // const handleSelectAllClick = (event) => {
  //   if (event.target.checked) {
  //     const newSelecteds = pendingFeesList?.map((n) => n?.id);
  //     setSelectedRows(newSelecteds);
  //     return;
  //   }
  //   setSelectedRows([]);
  // };

  const furtherToPay =
    Number(allResponse?.total_unpaid) ||
    0 - Number(allResponse?.student_wallet) ||
    0;

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleClick = (rowId) => {
    const selectedIndex = selectedRows.indexOf(rowId);
    const rowIndex = pendingFeesList.findIndex((row) => row.id === rowId); // Find the index of the clicked row

    if (selectedIndex === -1) {
      // Row is being selected
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, rowId]);
    } else {
      // Row is being unselected
      // Keep only the rows before the unselected row
      const newSelectedRows = selectedRows.filter((id) => {
        const idIndex = pendingFeesList.findIndex((row) => row.id === id);
        return idIndex < rowIndex;
      });
      setSelectedRows(newSelectedRows);
    }
  };

  // change to next or prev page

  // const handleChangePage = (_, newPage) => {
  //   if (!isLoading) setPage(newPage);
  // };

  // // change rows per page
  // const handleChangeRowsPerPage = (event) => {
  //   setPage(0);
  //   setRowsPerPage(parseInt(event.target.value, 10));
  // };

  // // if no search result is found
  // const notFound = !pendingFeesCount;

  const handlePayFees = async () => {
    setLoading(true);
    const response = await payFees({
      st_id: userInfo?.st_id,
      fpp_ids: selectedRows.join(","),
    });
    setLoading(false);

    if (response?.code === 200) {
      handleModalClose();
      refetch();
      toast.success(response?.message || "Fees paid successfully");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
    console.log(selectedRows.join(","), "selectedRows");
  };

  return (
    <>
      <Helmet>
        <title>Pending Fees | SAIFEE</title>
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
              Pending Fees - {userInfo?.name || ""} | ₹
              {FORMAT_INDIAN_CURRENCY(allResponse?.total_unpaid) || "0"}
            </Box>
            <TableContainer sx={{ overflowY: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      {/* <Checkbox
                        indeterminate={
                          selectedRows?.filter((id) =>
                            pendingFeesList?.some(
                              (student) => student?.id === id
                            )
                          )?.length > 0 &&
                          selectedRows?.filter((id) =>
                            pendingFeesList?.some(
                              (student) => student?.id === id
                            )
                          )?.length < pendingFeesList?.length
                        }
                        checked={
                          pendingFeesList?.length > 0 &&
                          selectedRows?.filter((id) =>
                            pendingFeesList?.some(
                              (student) => student?.id === id
                            )
                          )?.length === pendingFeesList?.length
                        }
                        onChange={handleSelectAllClick}
                      /> */}
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
                  {pendingFeesList?.map((row, index) => {
                    const isRowSelected = selectedRows?.indexOf(row?.id) !== -1;
                    return (
                      <PendingFeesTableRow
                        key={row?.id}
                        row={row}
                        isRowSelected={isRowSelected}
                        handleClick={handleClick}
                        index={index} // Pass the row index
                        selectedRows={selectedRows} // Pass the selected rows array
                        rows={pendingFeesList} // Pass the full list of rows
                        refetch={refetch}
                      />
                    );
                  })}

                  {/* <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, pendingFeesCount)}
                  />

                  {notFound && <TableNoData />} */}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination */}
            {/* <TablePagination
              page={page}
              component="div"
              count={pendingFeesCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}

            {selectedRows?.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 2,
                  mt: 2,
                  width: "100%",
                }}
              >
                <Box sx={{ width: "300px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>Total</Typography>
                    <Typography sx={{ color: "primary.main" }}>
                      ₹ {allResponse?.total_unpaid || "0"}/-
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      Adjusted From Wallet
                    </Typography>
                    <Typography sx={{ color: "primary.main" }}>
                      ₹ {allResponse?.student_wallet || "0"}/-
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      Further to Pay
                    </Typography>
                    <Typography sx={{ color: "primary.main" }}>
                      ₹{furtherToPay || "0"}
                      /-
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={handleModalOpen}
                    sx={{ minWidth: "120px" }}
                  >
                    Pay Fees
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      <DisclaimerDialog
        open={modalOpen}
        onCancel={handleModalClose}
        isLoading={loading}
        onConfirm={handlePayFees}
        furtherToPay={furtherToPay}
      />
    </>
  );
}

PendingFees.propTypes = {
  detail: PropTypes.object,
  academicYear: PropTypes.object,
};
