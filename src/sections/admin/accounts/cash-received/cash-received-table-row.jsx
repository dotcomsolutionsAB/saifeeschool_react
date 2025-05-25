import PropTypes from "prop-types";
import { Cancel, MoreVert, TaskAlt } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import { FORMAT_INDIAN_CURRENCY } from "../../../../utils/constants";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";

const CashReceivedTableRow = ({ row, index, refetch }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // open action menu open

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
    handleMenuClose();
  };

  const handleConfirmOrReject = async () => {
    setIsDeleteLoading(true);
    // const response = await deleteCashReceived(row);
    const response = { code: 500 }; // remove it once the api is ready
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Status updated successfully!");
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

        <TableCell>{row?.name || "-"}</TableCell>

        <TableCell>
          {row?.date ? dayjs(row?.date).format("DD-MM-YYYY") : "-"}
        </TableCell>

        <TableCell>{row?.type || "-"}</TableCell>
        <TableCell>{row?.details || "-"}</TableCell>
        <TableCell>₹ {FORMAT_INDIAN_CURRENCY(row?.amount) || ""}</TableCell>
        <TableCell>{row?.status || "-"}</TableCell>

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
      >
        <MenuItem
          onClick={handleConfirmationModalOpen}
          sx={{ color: "success.main" }}
        >
          <TaskAlt fontSize="small" sx={{ mr: 1 }} />
          Confirm
        </MenuItem>
        <MenuItem
          onClick={handleConfirmationModalOpen}
          sx={{ color: "error.main" }}
        >
          <Cancel fontSize="small" sx={{ cursor: "pointer", mr: 1 }} />
          Reject
        </MenuItem>
      </Menu>

      {/* Delete Confirmation*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleConfirmOrReject}
        isLoading={isDeleteLoading}
        title="Are you sure?"
      />
    </>
  );
};

CashReceivedTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
};

export default CashReceivedTableRow;
