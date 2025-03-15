import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import {
  createAcademicYear,
  updateAcademicYear,
} from "../../../../services/settings.service";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const AddNewYearModal = ({ open, onClose, refetch, detail }) => {
  const { logout } = useAuth();

  const initialState = {
    ay_name: "",
    start_date: null,
    end_date: null,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleFeePlan = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);
    if (detail?.ay_id) {
      response = await updateAcademicYear(formData);
    } else {
      response = await createAcademicYear(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(response?.message || "Fee plan added successfully");
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (detail?.ay_id) {
      let startDate = detail?.start_date || null;
      let endDate = detail?.end_date || null;

      // Extract start and end dates from start_end_date if needed
      if (!startDate || !endDate) {
        const dateRange = detail?.start_end_date?.trim();
        if (dateRange && dateRange.includes(" To ")) {
          const [start, end] = dateRange
            .split(" To ")
            .map((date) => date.trim());
          startDate =
            startDate ||
            (start ? dayjs(start, "DD-MM-YYYY").format("YYYY-MM-DD") : null);
          endDate =
            endDate ||
            (end ? dayjs(end, "DD-MM-YYYY").format("YYYY-MM-DD") : null);
        }
      }

      setFormData({
        ...initialState,
        ay_id: detail.ay_id,
        ay_name: detail?.ay_name || "",
        start_date: startDate,
        end_date: endDate,
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
          minWidth: { xs: "95vw", sm: "600px" },
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
        {detail?.ay_id ? "Edit New Year" : `Add New Year`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleFeePlan}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="ay_name"
                fullWidth
                required
                value={formData?.ay_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="From"
                name="start_date"
                slotProps={{ textField: { fullWidth: true, required: true } }}
                value={formData?.start_date ? dayjs(formData.start_date) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "start_date", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="To"
                name="end_date"
                slotProps={{ textField: { fullWidth: true, required: true } }}
                value={formData?.end_date ? dayjs(formData.end_date) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "end_date", value: newValue },
                  })
                }
              />
            </Grid>
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
              {isLoading ? <CircularProgress size={24} /> : `Save`}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

AddNewYearModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default AddNewYearModal;
