import PropTypes from "prop-types";
import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";

import {
  Box,
  Button,
  Card,
  CardContent,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";
import { useGetApi } from "../../../hooks/useGetApi";
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

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // api to get pending fees list
  const {
    dataList: pendingFeesList,
    allResponse,
    isLoading,
    isError,
    refetch,
    errorMessage,
  } = useGetApi({
    apiFunction: getPendingFees,
    body: {
      st_id: userInfo?.st_id,
      offset: 0,
      limit: 100,
    },
  });

  const furtherToPay =
    selectedRows?.reduce((total, row) => {
      return (
        total +
        Number(row?.fpp_amount || 0) +
        Number(row?.f_late_fee_applicable === "1" ? row?.fpp_late_fee : 0) -
        Number(row?.f_concession || 0)
      );
    }, 0) - Number(allResponse?.student_wallet || 0);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleClick = (selectedRowData) => {
    const selectedIndex = selectedRowIds.indexOf(selectedRowData?.id);
    const rowIndex = pendingFeesList.findIndex(
      (row) => row.id === selectedRowData?.id
    ); // Find the index of the clicked row

    if (selectedIndex === -1) {
      // Row is being selected
      setSelectedRows((prevSelectedRows) => [
        ...prevSelectedRows,
        selectedRowData,
      ]);
      setSelectedRowIds((prevSelectedRowIds) => [
        ...prevSelectedRowIds,
        selectedRowData?.id,
      ]);
    } else {
      // Row is being unselected
      // Keep only the rows before the unselected row
      const newSelectedRows = selectedRows.filter((option) => {
        const idIndex = pendingFeesList.findIndex(
          (row) => row.id === option.id
        );
        return idIndex < rowIndex;
      });
      const newSelectedRowIds = selectedRowIds.filter((id) => {
        const idIndex = pendingFeesList.findIndex((row) => row.id === id);
        return idIndex < rowIndex;
      });

      setSelectedRows(newSelectedRows);
      setSelectedRowIds(newSelectedRowIds);
    }
  };

  const handlePayFees = async () => {
    setLoading(true);
    const response = await payFees({
      st_id: userInfo?.st_id,
      fpp_ids: selectedRows?.map((row) => row?.fpp_id)?.join(","),
    });
    setLoading(false);

    console.log(response, "response from payFees");

    if (response?.code === 200) {
      handleModalClose();
      if (response?.url) {
        // const decodedUrl = decodeURIComponent(response.url);
        const decodedUrl = response.url;
        if (decodedUrl.startsWith("http")) {
          // window.location.href = decodedUrl;
          window.open(decodedUrl, "_self", "noopener,noreferrer");
        } else {
          toast.error("Invalid redirect URL");
        }
      }
      toast.success(response?.message || "Fees paid successfully");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
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
        <MessageBox errorMessage={errorMessage} />
      ) : (
        <Card sx={{ width: "100%", mt: 2 }}>
          <CardContent>
            <Box sx={{ mb: 2, fontSize: "20px" }}>
              Pending Fees - {userInfo?.name || ""} | ₹
              {FORMAT_INDIAN_CURRENCY(allResponse?.total_unpaid) || "0"}
            </Box>
            {allResponse?.last_payment_status === "pending" && (
              <Box sx={{ mb: 2, fontSize: "14px", color: "warning.main" }}>
                {allResponse?.last_payment_details || ""}
              </Box>
            )}
            <TableContainer sx={{ overflowY: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    {allResponse?.last_payment_status !== "pending" && (
                      <TableCell padding="checkbox"></TableCell>
                    )}
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
                    const isRowSelected =
                      selectedRowIds?.indexOf(row?.id) !== -1;
                    return (
                      <PendingFeesTableRow
                        key={row?.id}
                        row={row}
                        isRowSelected={isRowSelected}
                        handleClick={handleClick}
                        index={index} // Pass the row index
                        selectedRowIds={selectedRowIds} // Pass the selected rows array
                        rows={pendingFeesList} // Pass the full list of rows
                        allResponse={allResponse}
                        refetch={refetch}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedRowIds?.length > 0 && (
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
                  {/* <Box
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
                  </Box> */}
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
