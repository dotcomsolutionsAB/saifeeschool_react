import PropTypes from "prop-types";
import { Delete, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import dayjs from "dayjs";
import { FORMAT_INDIAN_CURRENCY } from "../../../../utils/constants";
import { deleteBankTransaction } from "../../../../services/admin/accounts.service";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";

const BanksTableRow = ({
  row,
  index,
  refetch,
  setFormData,
  handleScrollToTop,
}) => {
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

  const handleEdit = () => {
    setFormData({ ...row, sn: index + 1 });
    handleMenuClose();
    setTimeout(() => {
      handleScrollToTop();
    }, 200); // Delay to allow Menu to fully close before scrolling
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteBankTransaction(row);
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

        <TableCell>{row?.type || "-"}</TableCell>

        <TableCell>
          {row?.date ? dayjs(row?.date).format("DD-MM-YYYY") : "-"}
        </TableCell>

        <TableCell>₹ {FORMAT_INDIAN_CURRENCY(row?.amount) || ""}</TableCell>
        <TableCell>{row?.comments || "-"}</TableCell>
        <TableCell>{row?.user || "-"}</TableCell>

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
        <MenuItem onClick={handleEdit} sx={{ color: "primary.main" }}>
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
        title="Are you sure you want to delete this transaction?"
      />
    </>
  );
};

BanksTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  setFormData: PropTypes.func,
  handleScrollToTop: PropTypes.func,
  index: PropTypes.number,
};

export default BanksTableRow;
