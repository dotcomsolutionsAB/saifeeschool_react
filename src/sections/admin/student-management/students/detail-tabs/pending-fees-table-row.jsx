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
import { applyConcession } from "../../../../../services/admin/students-management.service";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import dayjs from "dayjs";

const PendingFeesTableRow = ({
  row,
  isRowSelected,
  handleClick,
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

  const handleEditOpen = () => {
    setIsEditable(true);
    setFormData(initialState);
  };

  const handleEditClose = () => {
    setIsEditable(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: Number(value) }));
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
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={isRowSelected}
            onChange={() => handleClick(row?.id)}
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>₹ {row?.fpp_amount || "-"}</TableCell>

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
                type="number"
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
                type="number"
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
              ₹ {row?.f_concession || "-"}
            </TableCell>
            <TableCell sx={{ width: "110px" }}>
              ₹ {row?.fpp_late_fee || "-"}
            </TableCell>
          </>
        )}

        <TableCell>₹ {row?.total_amount || "-"}</TableCell>

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
                <IconButton sx={{ cursor: "pointer", color: "error.main" }}>
                  <Iconify icon="material-symbols:delete-outline-rounded" />
                </IconButton>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

PendingFeesTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default PendingFeesTableRow;
