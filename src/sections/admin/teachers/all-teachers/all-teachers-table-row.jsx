import PropTypes from "prop-types";
import { Delete, MoreVert } from "@mui/icons-material";
import {
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";
import { useState } from "react";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import ConfirmationDialog from "../../../../components/confirmation-dialog/confirmation-dialog";
import AddNewTeacherModal from "./modals/add-new-teacher";
import { CAPITALIZE } from "../../../../utils/constants";
import { deleteTeacher } from "../../../../services/admin/teacher.service";

const AllTeachersTableRow = ({
  row,
  refetch,
  index,
  page,
  rowsPerPage,
  genderList,
  classTeacher,
  bloodGroupList,
}) => {
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
    const response = await deleteTeacher(row);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Teacher deleted successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} key={row?.id}>
        <TableCell>{page * rowsPerPage + index + 1 || ""}</TableCell>

        <TableCell>{row?.name || "-"}</TableCell>
        <TableCell>{row?.email || "-"}</TableCell>

        <TableCell align="center">
          <Typography>
            {row?.is_class_teacher === "1" ? "Yes" : "No"}
          </Typography>
          <Typography>
            {row?.is_class_teacher === "1" ? row?.class_name : ""}
          </Typography>
        </TableCell>

        <TableCell>{row?.mobile || "-"}</TableCell>
        <TableCell>{CAPITALIZE(row?.subject) || "-"}</TableCell>
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
        title="Are you sure you want to delete this teacher?"
      />

      {/* Edit Product*/}
      <AddNewTeacherModal
        open={editModalOpen}
        onClose={handleEditModalClose}
        refetch={refetch}
        detail={row}
        genderList={genderList || []}
        classTeacher={classTeacher || []}
        bloodGroupList={bloodGroupList || []}
      />
    </>
  );
};

AllTeachersTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  index: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  genderList: PropTypes.array,
  classTeacher: PropTypes.array,
  bloodGroupList: PropTypes.array,
};

export default AllTeachersTableRow;
