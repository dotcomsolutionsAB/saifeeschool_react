import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { CancelOutlined } from "@mui/icons-material";
import useAuth from "../../../../../hooks/useAuth";
import {
  createCharacterCertificate,
  getStudentByRollNo,
  updateCharacterCertificate,
} from "../../../../../services/admin/report-card-module.service";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const CreateEditCCModal = ({ open, onClose, refetch, detail }) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [newDataLoading, setNewDataLoading] = useState(false);

  const initialState = {
    st_roll_no: detail?.st_roll_no || "",
    name: detail?.name || "",
    joining_date: detail?.joining_date ? dayjs(detail?.joining_date) : null,
    leaving_date: detail?.leaving_date ? dayjs(detail?.leaving_date) : dayjs(),
    stream: detail?.stream || "",
    date_from: detail?.date_from ? dayjs(detail?.date_from) : null,
    dob: detail?.dob ? dayjs(detail?.dob) : null,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date" ? dayjs(value).format("YYYY-MM-DD") : value;
    setFormData((preValue) => ({
      ...preValue,
      [name]: parsedValue,
    }));
  };

  const handleCancel = () => {
    onClose();
    // setFormData(initialState);
  };

  const handleCreateEditCharacterCertificate = async (e) => {
    e.preventDefault();
    let response = null;
    setIsLoading(true);

    const payload = {
      ...formData,
      promotion:
        typeof formData?.promotion === "string"
          ? formData?.promotion
          : formData?.promotion?.value,
      joining_date: formData?.joining_date
        ? dayjs(formData?.joining_date).format("YYYY-MM-DD")
        : null,
      leaving_date: formData?.leaving_date
        ? dayjs(formData?.leaving_date).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      date_from: formData?.date_from
        ? dayjs(formData?.date_from).format("YYYY-MM-DD")
        : null,
      dob: formData?.dob ? dayjs(formData?.dob).format("YYYY-MM-DD") : null,
    };

    if (detail?.id) {
      response = await updateCharacterCertificate({
        ...payload,
        id: detail.id,
      });
    } else {
      response = await createCharacterCertificate(payload);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `${
            detail?.id
              ? "Character certificate created"
              : "Character certificate updated"
          } successfully`
      );
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  const fetchStudentDetail = async () => {
    setFormData((prevData) => ({
      ...prevData,
      ...initialState,
      st_roll_no: prevData?.st_roll_no,
    }));
    setNewDataLoading(true);
    const response = await getStudentByRollNo({
      st_roll_no: formData?.st_roll_no,
    });
    setNewDataLoading(false);
    if (response?.code === 401) {
      logout(response);
    } else if (response?.code !== 200) {
      return toast.error(response?.message || "Some error occurred.");
    } else {
      toast.success(response?.message || "Details fetched successfully");
    }

    const studentDetail = response?.data;

    setFormData((prev) => ({
      ...prev,
      name: studentDetail?.name || "",
      joining_date: studentDetail?.joining_date
        ? dayjs(studentDetail?.joining_date)
        : null,
      leaving_date: studentDetail?.leaving_date
        ? dayjs(studentDetail?.leaving_date)
        : dayjs(),
      date_from: studentDetail?.date_from
        ? dayjs(studentDetail?.date_from)
        : null,
      dob: studentDetail?.dob ? dayjs(studentDetail?.dob) : null,
    }));
  };

  useEffect(() => {
    let timer = null;

    if (!detail?.id && formData?.st_roll_no) {
      timer = setTimeout(fetchStudentDetail, 500);
    }

    if (!formData?.st_roll_no) {
      setFormData(initialState);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [formData?.st_roll_no]);
  return (
    <Dialog
      open={open}
      onClose={!isLoading ? handleCancel : null}
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
          ? "Edit Character Certificate"
          : `Add New Character Certificate`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleCreateEditCharacterCertificate}>
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
                slotProps={{
                  input: {
                    endAdornment: newDataLoading ? (
                      <InputAdornment position="end">
                        <IconButton>
                          <CircularProgress size={24} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
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
                value={
                  formData?.joining_date ? dayjs(formData?.joining_date) : null
                }
                onChange={(newValue) =>
                  handleChange({
                    target: {
                      type: "date",
                      name: "joining_date",
                      value: newValue,
                    },
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
                value={
                  formData?.leaving_date ? dayjs(formData?.leaving_date) : null
                }
                onChange={(newValue) =>
                  handleChange({
                    target: {
                      type: "date",
                      name: "leaving_date",
                      value: newValue,
                    },
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
                value={formData?.date_from ? dayjs(formData?.date_from) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: {
                      type: "date",
                      name: "date_from",
                      value: newValue,
                    },
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
                value={formData?.dob ? dayjs(formData?.dob) : null}
                onChange={(newValue) =>
                  handleChange({
                    type: "date",
                    target: { name: "dob", value: newValue },
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
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={isLoading || newDataLoading}
            >
              Close
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading || newDataLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} />
              ) : detail?.id ? (
                `Update`
              ) : (
                `Submit`
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CreateEditCCModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default CreateEditCCModal;
