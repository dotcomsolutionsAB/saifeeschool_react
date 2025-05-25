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
import useAuth from "../../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";

import dayjs from "dayjs";
import {
  createTeacher,
  updateTeacher,
} from "../../../../../services/admin/teacher.service";
import { DatePicker } from "@mui/x-date-pickers";

const AddNewTeacherModal = ({
  open,
  onClose,
  refetch,
  detail,
  genderList,
  classTeacher,
  bloodGroupList,
}) => {
  const { logout } = useAuth();

  const initialState = {
    name: "",
    address: "",
    email: "",
    gender: "",
    dob: null,
    blood_group: "",
    is_class_teacher: "",
    degree: "",
    qualification: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date" ? dayjs(value).format("YYYY-MM-DD") : value;
    setFormData((preValue) => ({ ...preValue, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;

    const payload = {
      ...formData,
      dob: formData?.dob ? dayjs(formData?.dob).format("YYYY-MM-DD") : null,
    };

    setIsLoading(true);
    if (detail?.id) {
      response = await updateTeacher(payload);
    } else {
      response = await createTeacher(payload);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Teacher ${detail?.id ? "updated" : "added"} successfully`
      );
    } else if (response?.code === 401) {
      logout(response);
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };

  useEffect(() => {
    if (detail?.id) {
      setFormData({
        ...initialState,
        id: detail?.id,
        name: detail?.name || "",
        address: detail?.address || "",
        email: detail?.email || "",
        gender: detail?.gender || "",
        dob: detail?.dob ? dayjs(detail?.dob) : null,
        blood_group: detail?.blood_group || "",
        is_class_teacher: detail?.is_class_teacher || "",
        degree: detail?.degree || "",
        qualification: detail?.qualification || "",
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
          minWidth: { xs: "95vw", sm: "550px", md: "800px", lg: "1100px" },
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
        {detail?.id ? "Edit Teacher" : `Add New Teacher`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                required
                value={formData?.address || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="email"
                label="Email"
                name="email"
                fullWidth
                required
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={genderList || []}
                getOptionLabel={(option) =>
                  option === "M" ? "Male" : "Female"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Gender"
                    name="gender"
                    required
                  />
                )}
                value={formData?.gender || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "gender", value: newValue },
                  })
                }
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
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={bloodGroupList || []}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Blood Group"
                    name="blood_group"
                    required
                  />
                )}
                value={formData?.blood_group || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "blood_group", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={classTeacher || []}
                getOptionLabel={(option) => (option === "1" ? "Yes" : "No")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Class Teacher"
                    name="is_class_teacher"
                    required
                  />
                )}
                value={formData?.is_class_teacher || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "is_class_teacher", value: newValue },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Degree"
                name="degree"
                fullWidth
                required
                value={formData?.degree || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Qualification"
                name="qualification"
                fullWidth
                required
                value={formData?.qualification || ""}
                onChange={handleChange}
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
              {isLoading ? (
                <CircularProgress size={24} />
              ) : detail?.id ? (
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

AddNewTeacherModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  genderList: PropTypes.array,
  classTeacher: PropTypes.array,
  bloodGroupList: PropTypes.array,
};

export default AddNewTeacherModal;
