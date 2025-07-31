import PropTypes from "prop-types";
import { Delete, MoreVert } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import CreateEditDebitVoucherModal from "./modals/create-edit-debit-voucher-modal";
import dayjs from "dayjs";
import {
  deleteDebitVoucher,
  printDebitPdf,
} from "../../../../services/admin/accounts.service";
import { FORMAT_INDIAN_CURRENCY } from "../../../../utils/constants";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";

const DebitVoucherTableRow = ({ row, index, refetch }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [debitVoucherEditModalOpen, setDebitVoucherEditModalOpen] =
    useState(false);
  const [isPrintLoading, setIsPrintLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // open action menu open

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // debit voucher modal handler

  const handleDebitVoucherEditModalOpen = () => {
    setDebitVoucherEditModalOpen(true);
  };

  const handleDebitVoucherEditModalClose = () => {
    setDebitVoucherEditModalOpen(false);
    handleMenuClose();
  };

  const handlePrint = async () => {
    setIsPrintLoading(true);
    const response = await printDebitPdf(row);
    setIsPrintLoading(false);

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
      handleMenuClose();
      toast.success(response?.message || "File downloaded successfully!");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
    handleMenuClose();
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteDebitVoucher(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Item deleted successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{index + 1 || "-"}</TableCell>

        <TableCell>{row?.debit_no || "-"}</TableCell>

        <TableCell>
          {row?.date ? dayjs(row?.date).format("DD-MM-YYYY") : "-"}
        </TableCell>

        <TableCell>₹ {FORMAT_INDIAN_CURRENCY(row?.amount) || ""}</TableCell>
        <TableCell>{row?.paid_to || "-"}</TableCell>
        <TableCell>{row?.debit || "-"}</TableCell>
        <TableCell>{row?.cheque_no || "-"}</TableCell>
        <TableCell>{row?.description || "-"}</TableCell>

        <TableCell align="center">
          <IconButton sx={{ cursor: "pointer" }} onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Row-Specific Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ color: "primary.main" }}
      >
        {isPrintLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          <MenuItem onClick={handlePrint} sx={{ color: "primary.main" }}>
            <Iconify icon="mdi-light:printer" sx={{ mr: 1 }} />
            Print
          </MenuItem>
        )}
        <MenuItem
          onClick={handleDebitVoucherEditModalOpen}
          sx={{ color: "primary.main" }}
        >
          <Iconify icon="basil:edit-outline" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={handleConfirmationModalOpen}
          sx={{ color: "primary.main" }}
        >
          <Delete fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this?"
      />

      {/* Create Edit Debit Voucher Dialog */}
      <CreateEditDebitVoucherModal
        open={debitVoucherEditModalOpen}
        onClose={handleDebitVoucherEditModalClose}
        refetch={refetch}
        detail={row}
      />
    </>
  );
};

DebitVoucherTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
};

export default DebitVoucherTableRow;
