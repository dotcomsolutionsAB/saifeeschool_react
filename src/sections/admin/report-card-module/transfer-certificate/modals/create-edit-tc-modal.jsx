import PropTypes from "prop-types";
import { useEffect, useState } from "react";

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
import { CancelOutlined } from "@mui/icons-material";
import useAuth from "../../../../../hooks/useAuth";
import {
  createTransferCertificate,
  getStudentByRollNo,
  updateTransferCertificate,
} from "../../../../../services/admin/report-card-module.service";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const PROMOTION_LIST = [
  {
    id: "1",
    label: "Not Applicable",
    value: "NotApplicable",
  },
  {
    id: "2",
    label: "Refused",
    value: "Refused",
  },
  {
    id: "3",
    label: "Approved",
    value: "Promoted",
  },
];

const CreateEditTCModal = ({ open, onClose, refetch, detail }) => {
  console.log(detail, "detail");
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    st_roll_no: detail?.st_roll_no || "",
    name: detail?.name || "",
    father_name: detail?.father_name || "",
    joining_class: detail?.joining_class || "",
    joining_date: detail?.joining_date || "",
    leaving_date: detail?.leaving_date || dayjs(),
    prev_school: detail?.prev_school || "",
    character: detail?.character || "",
    class: detail?.class || "",
    stream: detail?.stream || "",
    date_from: detail?.date_from || "",
    date_to: detail?.date_to || "",
    dob: detail?.dob || "",
    promotion: detail?.promotion || "",
  };

  const [formData, setFormData] = useState(initialState);
  console.log(formData, "formData");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };

  const handleCreateEditTransferCertificate = async (e) => {
    e.preventDefault();
    let response = null;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateTransferCertificate({
        ...formData,
        id: detail.id,
        promotion:
          typeof formData?.promotion === "string"
            ? formData?.promotion
            : formData?.promotion?.value,
      });
    } else {
      response = await createTransferCertificate({
        ...formData,
        promotion: formData?.promotion?.value,
      });
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `${detail?.id ? "TC created" : "TC updated"} successfully`
      );
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const fetchStudentDetail = async () => {
    const response = await getStudentByRollNo({
      st_roll_no: formData?.st_roll_no,
    });

    const studentDetail = response?.data;

    setFormData((prev) => ({
      ...prev,
      name: studentDetail?.name || "",
      father_name: studentDetail?.fathers_name || "",
      joining_class: studentDetail?.st_admitted_class || "",
      // joining_date: studentDetail?.st_admitted
      //   ? dayjs(studentDetail?.st_admitted, "DD-MM-YYYY").isValid()
      //     ? dayjs(studentDetail?.st_admitted, "DD-MM-YYYY")
      //     : null
      //   : null,
      // dob: studentDetail?.st_dob
      //   ? dayjs(studentDetail?.st_dob).format("YYYY-MM-DD")
      //   : "",
    }));
  };

  useEffect(() => {
    let timer = null;

    if (!detail?.id && formData?.st_roll_no) {
      timer = setTimeout(fetchStudentDetail, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData?.st_roll_no]);

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
      PaperProps={{
        sx: {
          minWidth: { xs: "90%", md: "800px", lg: "1000px" },
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
        {detail?.id
          ? "Edit Transfer Certificate"
          : `Add New Transfer Certificate`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleCreateEditTransferCertificate}>
          <Grid container spacing={4}>
            {/* Roll No */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="st_roll_no"
                label="Roll No"
                required
                fullWidth
                value={formData?.st_roll_no || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Name */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="name"
                label="Name"
                required
                fullWidth
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Father Name */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="father_name"
                label="Father's Name"
                required
                fullWidth
                value={formData?.father_name || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Joining Class */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="joining_class"
                label="Joined in Class"
                required
                fullWidth
                value={formData?.joining_class || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Previous School */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="prev_school"
                label="Previous School"
                required
                fullWidth
                value={formData?.prev_school || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Character */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="character"
                label="Character"
                required
                fullWidth
                value={formData?.character || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Class */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="class"
                label="Class"
                required
                fullWidth
                value={formData?.class || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Stream */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="stream"
                label="Stream"
                required
                fullWidth
                value={formData?.stream || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Admitted Date*/}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="joining_date"
                label="Admitted Date"
                value={formData?.joining_date || null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "joining_date", value: newValue },
                  })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
                disableFuture
              />
            </Grid>

            {/* Leaving Date */}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="leaving_date"
                label="Leaving Date"
                value={formData?.leaving_date || null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "leaving_date", value: newValue },
                  })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
                disableFuture
              />
            </Grid>

            {/* Date From */}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="date_from"
                label="Date From"
                value={formData?.date_from || null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "date_from", value: newValue },
                  })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
                disableFuture
              />
            </Grid>

            {/* Date To*/}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="date_to"
                label="Date To"
                value={formData?.date_to || null}
                onChange={(newValue) =>
                  handleChange({
                    target: { name: "date_to", value: newValue },
                  })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
                disableFuture
              />
            </Grid>

            {/* Date of Birth */}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="dob"
                label="Date of Birth"
                value={formData?.dob || null}
                onChange={(newValue) =>
                  handleChange({ target: { name: "dob", value: newValue } })
                }
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
                disableFuture
              />
            </Grid>

            {/* Promotion */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={PROMOTION_LIST || []}
                getOptionLabel={(option) => option?.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="promotion"
                    label="Promotion"
                    required
                    fullWidth
                  />
                )}
                value={formData?.promotion || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "promotion", value: newValue },
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
              gap: 1,
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Close
            </Button>
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : `Submit`}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CreateEditTCModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default CreateEditTCModal;
