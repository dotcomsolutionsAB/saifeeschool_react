import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Iconify from "../../../../../../components/iconify/iconify";
import { deleteFeePlan } from "../../../../../../services/admin/fee-plan.service";
import { toast } from "react-toastify";
import useAuth from "../../../../../../hooks/useAuth";
import AddNewFeePlanModal from "../modals/add-new-fee-plan-modal";
import {
  FORMAT_INDIAN_CURRENCY,
  TYPE_LIST,
} from "../../../../../../utils/constants";
import ConfirmationDialog from "../../../../../../components/confirmation-dialog/confirmation-dialog";
import dayjs from "dayjs";

const AdmissionFeesTableRow = ({ row, refetch, academicYear }) => {
  const { logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setModalOpen(false);
  };

  const handleConfirmationModalOpen = () => {
    setConfirmationModalOpen(true);
  };

  const handleConfirmationModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    const response = await deleteFeePlan({
      id: row?.fp_id,
    });

    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Fee plan deleted successfully");
      refetch();
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          {row?.last_due_date
            ? dayjs(row?.last_due_date).format("DD-MM-YYYY")
            : "-"}
        </TableCell>

        <TableCell>{`₹ ${
          FORMAT_INDIAN_CURRENCY(row?.last_fpp_amount) || "0"
        }`}</TableCell>

        <TableCell>{row?.applied_students || "-"}</TableCell>

        <TableCell align="right">
          <Box sx={{ display: "flex", alignItems: "right" }}>
            <IconButton
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={handleEditModalOpen}
            >
              <Iconify icon="lucide:edit" />
            </IconButton>
            <IconButton
              sx={{ cursor: "pointer", color: "error.main" }}
              onClick={handleConfirmationModalOpen}
            >
              <Iconify icon="material-symbols:delete-outline-rounded" />
            </IconButton>
          </Box>
        </TableCell>
      </TableRow>
      {/* modal */}

      <AddNewFeePlanModal
        open={modalOpen}
        onClose={handleEditModalClose}
        academicYear={academicYear}
        refetch={refetch}
        type={TYPE_LIST[0]}
        detail={row}
      />

      <ConfirmationDialog
        open={confirmationModalOpen}
        onConfirm={handleDelete}
        onCancel={handleConfirmationModalClose}
        isLoading={isLoading}
      />
    </>
  );
};

AdmissionFeesTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  academicYear: PropTypes.object,
};

export default AdmissionFeesTableRow;
