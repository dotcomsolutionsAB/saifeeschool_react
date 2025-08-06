import PropTypes from "prop-types";
import {
  Box,
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Iconify from "../../../../../components/iconify/iconify";
import { useState } from "react";
import {
  applyConcession,
  deleteFees,
} from "../../../../../services/admin/students-management.service";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import dayjs from "dayjs";
import {
  FORMAT_INDIAN_CURRENCY,
  handleNumericInput,
} from "../../../../../utils/constants";
import ConfirmationDialog from "../../../../../components/confirmation-dialog/confirmation-dialog";

const PendingFeesTableRow = ({
  row,
  isRowSelected,
  handleClick,
  selectedRowIds,
  rows,
  allResponse,
  refetch,
  detail,
}) => {
  const { logout } = useAuth();
  const initialState = {
    fpp_id: Number(row?.fpp_id),
    st_id: detail?.id || "",
    concession_amount: Number(row?.f_concession),
    late_fee: Number(row?.fpp_late_fee),
  };

  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  // Check if current row is compulsory (monthly fee)
  const isCompulsory = row?.is_compulsory === "1";

  let isDisabled = false;

  if (isCompulsory) {
    // For compulsory fees, find the previous compulsory fee and check if it's selected
    const compulsoryRows = rows.filter((r) => r?.is_compulsory === "1");
    const currentCompulsoryIndex = compulsoryRows.findIndex(
      (r) => r.id === row.id
    );

    if (currentCompulsoryIndex > 0) {
      const previousCompulsoryRow = compulsoryRows[currentCompulsoryIndex - 1];
      isDisabled = !selectedRowIds.includes(previousCompulsoryRow?.id);
    }
  }
  // For non-compulsory fees (is_compulsory === "0"), isDisabled remains false

  const handleEditOpen = () => {
    setIsEditable(true);
    setFormData(initialState);
  };

  const handleEditClose = () => {
    setIsEditable(false);
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = handleNumericInput(value);
    setFormData((preValue) => ({ ...preValue, [name]: numericValue }));
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    const response = await deleteFees(row?.id);
    setIsDeleteLoading(false);

    if (response?.code === 200) {
      handleConfirmationModalClose();
      toast.success(response?.message || "Fees deleted successfully!");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleSave = async () => {
    if (formData?.concession_amount > Number(row?.fpp_amount)) {
      toast.error("Concession cannot be more than the total amount.");
      return;
    }

    if (formData?.late_fee < 0) {
      toast.error("Late fee cannot be negative.");
      return;
    }
    const response = await applyConcession(formData);
    if (response?.code === 200) {
      refetch();
      handleEditClose();
      toast.success(response?.message || "Concession updated successfully");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        {allResponse?.last_payment_status !== "pending" && (
          <TableCell padding="checkbox">
            <Checkbox
              disableRipple
              checked={isRowSelected}
              onChange={() => handleClick(row)}
              disabled={isDisabled} // Disable based on previous row's selection
            />
          </TableCell>
        )}
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_amount) || "-"}
        </TableCell>

        <TableCell>
          <Typography noWrap>
            {row?.fpp_due_date
              ? dayjs(row?.fpp_due_date).format("DD-MM-YYYY")
              : "-"}
          </Typography>
        </TableCell>

        {isEditable ? (
          <>
            <TableCell sx={{ width: "110px" }}>
              <TextField
                name="concession_amount"
                required
                fullWidth
                value={formData?.concession_amount ?? 0}
                onChange={handleChange}
                slotProps={{
                  input: {
                    sx: {
                      height: "30px",
                    },
                  },
                }}
              />
            </TableCell>
            <TableCell sx={{ width: "110px" }}>
              <TextField
                name="late_fee"
                required
                fullWidth
                value={formData?.late_fee ?? 0}
                onChange={handleChange}
                slotProps={{
                  input: {
                    sx: {
                      height: "30px",
                    },
                  },
                }}
              />
            </TableCell>
          </>
        ) : (
          <>
            <TableCell sx={{ width: "110px" }}>
              ₹ {FORMAT_INDIAN_CURRENCY(row?.f_concession) || "0"}
            </TableCell>
            <TableCell sx={{ width: "110px" }}>
              ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_late_fee) || "0"}
            </TableCell>
          </>
        )}

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.total_amount) || "0"}
        </TableCell>

        <TableCell align="center">
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isEditable ? (
              <>
                <IconButton
                  sx={{ cursor: "pointer", color: "error.main" }}
                  onClick={handleEditClose}
                >
                  <Iconify icon="carbon:close-filled" />
                </IconButton>
                <IconButton
                  sx={{ cursor: "pointer", color: "success.main" }}
                  onClick={handleSave}
                >
                  <Iconify icon="charm:circle-tick" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  sx={{ cursor: "pointer", color: "primary.main" }}
                  onClick={handleEditOpen}
                >
                  <Iconify icon="lucide:edit" />
                </IconButton>
                <IconButton
                  sx={{ cursor: "pointer", color: "error.main" }}
                  onClick={handleConfirmationModalOpen}
                >
                  <Iconify icon="material-symbols:delete-outline-rounded" />
                </IconButton>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>

      {/* Delete Confirmation*/}
      <ConfirmationDialog
        open={confirmationModalOpen}
        onCancel={handleConfirmationModalClose}
        onConfirm={handleDelete}
        isLoading={isDeleteLoading}
        title="Are you sure you want to delete this fee?"
      />
    </>
  );
};

PendingFeesTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  selectedRowIds: PropTypes.array,
  rows: PropTypes.array,
  allResponse: PropTypes.object,
};

export default PendingFeesTableRow;
