import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import { TYPE_LIST } from "../../../../../utils/constants";
import {
  createFeePlan,
  updateFeePlan,
} from "../../../../../services/fee-plan.service";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddNewFeePlanModal = ({
  open,
  onClose,
  academicYear,
  refetch,
  type,
  detail,
}) => {
  const { logout } = useAuth();

  const initialState = {
    ay_id: Number(academicYear?.ay_id),
    fp_name: "",
    type: type || null,
    amount: 0,
    due_date: null,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({
      ...preValue,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);

    if (
      formData?.type?.value === "monthly" ||
      formData?.type?.value === "recurring"
    ) {
      delete formData?.amount;
      delete formData?.due_date;
    }
    if (detail?.fp_id) {
      response = await updateFeePlan({
        ...formData,
        type: formData?.type?.value,
      });
    } else {
      response = await createFeePlan({
        ...formData,
        type: formData?.type?.value,
      });
    }
    setIsLoading(false);

    if (response?.code === 200) {
      toast.success(response?.message || "Class added successfully");
      setFormData(initialState);
      onClose();
      refetch();
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (detail?.fp_id) {
      setFormData({
        ...initialState,
        fp_id: detail.fp_id,
        fp_name: detail?.fp_name || "",
        type: type,
        amount: detail?.last_fpp_amount ?? 0,
        due_date: dayjs(detail?.last_due_date) || null,
      });
    } else {
      setFormData(initialState);
    }
  }, [open]);
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      PaperProps={{
        sx: {
          minWidth: "600px",
          position: "relative",
        },
      }}
    >
      <CancelOutlined
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "primary.contrastText",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={!isLoading ? onClose : null}
      />
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "primary.main",
          color: "primary.contrastText",
          textAlign: "center",
          fontWeight: 600,
        }}
      >
        {detail?.fp_id ? `Edit Fee Plan` : `Add Fee Plan`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="fp_name"
                fullWidth
                required
                value={formData?.fp_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={TYPE_LIST || []}
                getOptionLabel={(option) => option?.label || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    name="type"
                    fullWidth
                    required
                  />
                )}
                value={formData?.type || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "type", value: newValue },
                  })
                }
              />
            </Grid>
            {(formData?.type?.value === "admission" ||
              formData?.type?.value === "one_time") && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    fullWidth
                    required
                    value={formData?.amount ?? 0}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Due Date"
                    name="due_date"
                    slotProps={{
                      textField: { fullWidth: true },
                    }}
                    value={formData?.due_date ? dayjs(formData.due_date) : null} // Ensure proper value handling
                    onChange={(newValue) =>
                      handleChange({
                        target: {
                          name: "due_date",
                          value: newValue
                            ? dayjs(newValue).format("YYYY-MM-DD")
                            : null, // Extract only the date
                        },
                      })
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? (
                <CircularProgress size={24} />
              ) : detail?.fp_id ? (
                "Update"
              ) : (
                `Save`
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddNewFeePlanModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  academicYear: PropTypes.object,
  type: PropTypes.object,
  detail: PropTypes.object,
};

export default memo(AddNewFeePlanModal);
