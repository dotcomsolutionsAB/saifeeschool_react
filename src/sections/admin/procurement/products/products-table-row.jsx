import PropTypes from "prop-types";
import { Delete, MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, TableCell, TableRow } from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import AddNewProductModal from "./modals/add-new-product-modal";
import { deleteItem } from "../../../../services/admin/procurement.service";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";

const ProductsTableRow = ({ row, refetch, index, page, rowsPerPage }) => {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // open action menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    handleMenuClose();
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
    const response = await deleteItem(row?.id);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Item deleted successfully!");
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} key={row?.id} role="checkbox">
        <TableCell>{page * rowsPerPage + index + 1 || ""}</TableCell>

        <TableCell>{row?.name || "-"}</TableCell>

        <TableCell>{row?.category || "-"}</TableCell>

        <TableCell>{row?.sub_category || "-"}</TableCell>
        <TableCell>{row?.unit || "-"}</TableCell>
        <TableCell>{row?.price || "-"}</TableCell>
        <TableCell>{row?.discount || "-"}</TableCell>
        <TableCell>{row?.hsn || "-"}</TableCell>
        <TableCell align="center">
          <IconButton onClick={handleMenuOpen}>
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
        <MenuItem onClick={handleEditModalOpen} sx={{ color: "primary.main" }}>
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

      {/* Delete Product*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this item?"
      />

      {/* Edit Product*/}
      <AddNewProductModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
      />
    </>
  );
};

ProductsTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default ProductsTableRow;
