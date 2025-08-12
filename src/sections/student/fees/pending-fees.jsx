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
  CircularProgress,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
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
  const [redirectUrl, setRedirectUrl] = useState("");

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

  const selectedFees = selectedRows?.reduce((total, row) => {
    return (
      total +
      Number(row?.fpp_amount || 0) +
      Number(row?.f_late_fee_applicable === "1" ? row?.fpp_late_fee : 0) -
      Number(row?.f_concession || 0)
    );
  }, 0);

  const furtherToPay =
    selectedFees >= allResponse?.student_wallet
      ? selectedFees - Number(allResponse?.student_wallet || 0)
      : 0;

  const handleClick = (selectedRowData) => {
    const selectedIndex = selectedRowIds.indexOf(selectedRowData?.id);

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
      if (selectedRowData?.is_compulsory === "1") {
        // For compulsory fees, unselect this row and all subsequent compulsory rows
        const compulsoryRows = pendingFeesList.filter(
          (row) => row?.is_compulsory === "1"
        );
        const unselectedRowIndex = compulsoryRows.findIndex(
          (row) => row.id === selectedRowData?.id
        );

        // Get IDs of compulsory rows that should be unselected (current and all after it)
        const compulsoryRowsToUnselect = compulsoryRows
          .slice(unselectedRowIndex)
          .map((row) => row.id);

        // Keep only rows that are not in the unselect list
        const newSelectedRows = selectedRows.filter(
          (row) => !compulsoryRowsToUnselect.includes(row.id)
        );
        const newSelectedRowIds = selectedRowIds.filter(
          (id) => !compulsoryRowsToUnselect.includes(id)
        );

        setSelectedRows(newSelectedRows);
        setSelectedRowIds(newSelectedRowIds);
      } else {
        // For non-compulsory fees, just unselect this single row
        const newSelectedRows = selectedRows.filter(
          (row) => row.id !== selectedRowData?.id
        );
        const newSelectedRowIds = selectedRowIds.filter(
          (id) => id !== selectedRowData?.id
        );

        setSelectedRows(newSelectedRows);
        setSelectedRowIds(newSelectedRowIds);
      }
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setRedirectUrl("");
    setLoading(false); // Reset loading state
  };

  const handlePayFees = async () => {
    setLoading(true);
    const response = await payFees({
      st_id: userInfo?.st_id,
      fpp_ids: selectedRows?.map((row) => row?.fpp_id)?.join(","),
    });
    setLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Payment link generated");
      if (response?.url) {
        const decodedUrl = response.url;
        if (decodedUrl.startsWith("http")) {
          setRedirectUrl(decodedUrl);
          handleModalOpen();
          // Don't clear rows yet - wait for user confirmation
        } else {
          toast.error("Invalid redirect URL");
          // Clear rows only on error
          setSelectedRows([]);
          setSelectedRowIds([]);
        }
      } else {
        // No URL means wallet adjustment - clear rows and refresh
        setSelectedRows([]);
        setSelectedRowIds([]);
        handleModalClose();
        refetch();
      }
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleWalletAdjustment = async () => {
    setLoading(true);
    const response = await payFees({
      st_id: userInfo?.st_id,
      fpp_ids: selectedRows?.map((row) => row?.fpp_id)?.join(","),
    });
    setLoading(false);

    if (response?.code === 200) {
      setSelectedRows([]);
      setSelectedRowIds([]);
      handleModalClose();
      refetch();
      toast.success(response?.message || "Fees adjusted successfully");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleRedirect = () => {
    // Show loading during redirect
    setLoading(true);

    // Clear rows before redirect since payment is confirmed
    setSelectedRows([]);
    setSelectedRowIds([]);
    refetch();
    window.open(redirectUrl, "_self", "noopener,noreferrer");

    // Small delay to show loading
    setTimeout(() => {
      setModalOpen(false);
      setLoading(false);
    }, 500);
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
              Pending Fees - {userInfo?.name || ""}
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
                  {pendingFeesList?.map((row) => {
                    const isRowSelected =
                      selectedRowIds?.indexOf(row?.id) !== -1;
                    return (
                      <PendingFeesTableRow
                        key={row?.id}
                        row={row}
                        isRowSelected={isRowSelected}
                        handleClick={handleClick}
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
                      ₹{" "}
                      {furtherToPay > 0
                        ? allResponse?.student_wallet || "0"
                        : selectedFees}
                      /-
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
                  {furtherToPay > 0 ? (
                    <Button
                      variant="contained"
                      onClick={handlePayFees}
                      sx={{ minWidth: "120px" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        `Pay ₹${furtherToPay}`
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleModalOpen}
                      sx={{ minWidth: "120px" }}
                    >
                      Adjust Fees
                    </Button>
                  )}
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
        onConfirm={redirectUrl ? handleRedirect : handleWalletAdjustment}
        furtherToPay={furtherToPay}
        redirectUrl={redirectUrl}
      />
    </>
  );
}

PendingFees.propTypes = {
  detail: PropTypes.object,
  academicYear: PropTypes.object,
};
