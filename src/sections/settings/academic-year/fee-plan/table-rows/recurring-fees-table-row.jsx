import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Iconify from "../../../../../components/iconify/iconify";
import {
  createMonthlyFeePlan,
  deleteFeePlan,
} from "../../../../../services/fee-plan.service";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import AddNewFeePlanModal from "../modals/add-new-fee-plan-modal";
import { TYPE_LIST } from "../../../../../utils/constants";
import ConfirmationDialog from "../../../../../components/confirmation-dialog/confirmation-dialog";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const MONTH_LIST = [
  { id: "1", label: "April", value: "april" },
  { id: "2", label: "May", value: "may" },
  { id: "3", label: "June", value: "june" },
  { id: "4", label: "July", value: "july" },
  { id: "5", label: "August", value: "august" },
  { id: "6", label: "September", value: "september" },
  { id: "7", label: "October", value: "october" },
  { id: "8", label: "November", value: "november" },
  { id: "9", label: "December", value: "december" },
  { id: "10", label: "January", value: "january" },
  { id: "11", label: "February", value: "february" },
  { id: "12", label: "March", value: "march" },
];

const HEAD_LABEL = [
  { id: "month", label: "Month" },
  { id: "amount", label: "Amount", width: "150px" },
  { id: "due_date", label: "Due Date", width: "250px" },
];

const RecurringFeesTableRow = ({ row, refetch, academicYear }) => {
  const { logout } = useAuth();

  const initialState = {
    ay_id: Number(academicYear?.ay_id),
    fp_id: Number(row?.fp_id),
    fees: MONTH_LIST.map((month, index) => ({
      amount: 0, // Default empty amount
      due_date: dayjs()
        .month(index + 3)
        .date(10)
        .format("YYYY-MM-DD"), // Starts from April (Month index 3)
    })),
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateLoading, setIsGenerateLoading] = useState(false);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [formData, setFormData] = useState(initialState);

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

  const handleGenerateMonthlyFeesOpen = (event, option) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGenerateMonthlyFeesClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFees = [...(prev.fees || [])];
      updatedFees[index] = {
        ...updatedFees[index],
        [name]:
          name === "due_date"
            ? dayjs(value).format("YYYY-MM-DD")
            : Number(value),
      };

      return { ...prev, fees: updatedFees };
    });
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
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const handleGenerateMonthlyFee = async (e) => {
    e.preventDefault();
    setIsGenerateLoading(true);
    const response = await createMonthlyFeePlan(formData);
    setIsGenerateLoading(false);

    if (response?.code === 200) {
      handleGenerateMonthlyFeesClose();
      refetch();
      toast.success(response?.message || "Fee plan added successfully");
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
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

        <TableCell>{"N/A"}</TableCell>

        <TableCell>{"N/A"}</TableCell>

        <TableCell>{row?.applied_students || "-"}</TableCell>

        <TableCell align="right">
          <Box sx={{ display: "flex", alignItems: "right" }}>
            <Tooltip title="Generate Monthly Fees" arrow>
              <IconButton
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={handleGenerateMonthlyFeesOpen}
              >
                <Iconify icon="mdi:eye" />
              </IconButton>
            </Tooltip>
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
        type={TYPE_LIST[3]}
        detail={row}
      />

      <ConfirmationDialog
        open={confirmationModalOpen}
        onConfirm={handleDelete}
        onCancel={handleConfirmationModalClose}
        isLoading={isLoading}
      />

      {/* popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleGenerateMonthlyFeesClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
            },
          },
        }}
      >
        <Box component="form" onSubmit={handleGenerateMonthlyFee}>
          {/* table */}
          <TableContainer sx={{ overflow: "auto" }}>
            <Table sx={{ maxWidth: 500 }}>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  {HEAD_LABEL?.map((headCell, index) => (
                    <TableCell
                      key={headCell?.id}
                      align={headCell?.align || "center"}
                      sx={{
                        width: headCell?.width,
                        minWidth: headCell?.minWidth,
                        whiteSpace: "nowrap",
                        color: "primary.contrastText",
                        borderLeft: index !== 0 && "1px solid #DDDEEE",
                      }}
                    >
                      {headCell?.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {MONTH_LIST?.map((option, index) => (
                  <TableRow key={option?.id}>
                    <TableCell>
                      <Typography>{option?.label}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderLeft: "1px solid #DDDEEE" }}>
                      <TextField
                        label="Amount"
                        name="amount"
                        fullWidth
                        size="small"
                        type="number"
                        value={formData?.fees?.[index]?.amount || ""}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </TableCell>
                    <TableCell sx={{ borderLeft: "1px solid #DDDEEE" }}>
                      <DatePicker
                        label="Due Date"
                        name="due_date"
                        value={
                          formData?.fees?.[index]?.due_date
                            ? dayjs(formData.fees[index].due_date)
                            : null
                        }
                        onChange={(newValue) =>
                          handleChange(
                            {
                              target: { name: "due_date", value: newValue },
                            },
                            index
                          )
                        }
                        slotProps={{
                          textField: { fullWidth: true, size: "small" },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* submit button */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              py: 2,
              px: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleGenerateMonthlyFeesClose}
              disabled={isGenerateLoading}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isGenerateLoading}
            >
              {isGenerateLoading ? <CircularProgress size={24} /> : `Save`}
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

RecurringFeesTableRow.propTypes = {
  row: PropTypes.object,
  refetch: PropTypes.func,
  academicYear: PropTypes.object,
};

export default RecurringFeesTableRow;
