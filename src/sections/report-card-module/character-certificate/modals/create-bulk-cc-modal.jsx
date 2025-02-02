import PropTypes from "prop-types";
import { useState } from "react";

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
import useAuth from "../../../../hooks/useAuth";
import { createBulkCharacterCertificate } from "../../../../services/report-card-module.service";
import { DatePicker } from "@mui/x-date-pickers";
import { getAllClasses } from "../../../../services/students-management.service";
import { useGetApi } from "../../../../hooks/useGetApi";

const CreateBulkCCModal = ({ open, onClose, refetch, detail }) => {
  const { logout, userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    leaving_date: detail?.leaving_date || "",
    stream: detail?.stream || "",
    date_from: detail?.date_from || "",
    dob: detail?.dob || "",
  };

  const [formData, setFormData] = useState(initialState);

  // api to get classList

  const { dataList: classList } = useGetApi({
    apiFunction: getAllClasses,
    body: {
      ay_id: userInfo?.ay_id,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };

  const handleCreateBulkCharacterCertificate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await createBulkCharacterCertificate({
      ...formData,
      cg_id: formData?.class_group?.cgId,
    });

    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message || `Bulk character certificate created successfully`
      );
    } else if (response?.code === 401) {
      logout();
      toast.error(response?.message || "Unauthorized");
    } else {
      toast.error(response?.message || "Some error occurred.");
    }
  };
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
        Add New Bulk Character Certificate
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleCreateBulkCharacterCertificate}>
          <Grid container spacing={4}>
            {/* Class */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={classList || []}
                getOptionLabel={(option) => option?.cg_name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Class" fullWidth />
                )}
                value={formData?.class_group || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "class_group", value: newValue },
                  })
                }
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
              {isLoading ? <CircularProgress size={24} /> : `Create CC`}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

CreateBulkCCModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
};

export default CreateBulkCCModal;
