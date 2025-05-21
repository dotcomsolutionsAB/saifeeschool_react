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
import {
  createSupplier,
  updateSupplier,
} from "../../../../../services/admin/procurement.service";

const AddNewSupplierModal = ({
  open,
  onClose,
  refetch,
  detail,
  gstinTypeList,
}) => {
  const { logout } = useAuth();

  const initialState = {
    company: "",
    name: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    city: "",
    pincode: null,
    gstin: "",
    gstin_type: "",
    state: "",
    country: "",
    documents: "",
    notes: "",
    notification: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setFormData((preValue) => ({ ...preValue, [name]: parsedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateSupplier(formData);
    } else {
      response = await createSupplier(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Supplier ${detail?.id ? "updated" : "added"} successfully`
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
        company: detail?.company || "",
        name: detail?.name || "",
        email: detail?.email || "",
        mobile: detail?.mobile || "",
        address1: detail?.address1 || "",
        address2: detail?.address2 || "",
        city: detail?.city || "",
        pincode: Number(detail?.pincode) || null,
        gstin: detail?.gstin || "",
        gstin_type: detail?.gstin_type || "",
        state: detail?.state || "",
        country: detail?.country || "",
        documents: detail?.documents || "",
        notes: detail?.notes || "",
        notification: detail?.notification || "",
        log_date: detail?.log_date || "",
        log_user: detail?.log_user || "",
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
          minWidth: { xs: "95vw", sm: "600px", md: "850px", lg: "1100px" },
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
        {detail?.id ? "Edit Supplier" : `Add New Supplier`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Company Name"
                name="company"
                fullWidth
                required
                value={formData?.company || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Supplier Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                required
                value={formData?.email || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Mobile"
                name="mobile"
                fullWidth
                required
                value={formData?.mobile || ""}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="City"
                name="city"
                fullWidth
                required
                value={formData?.city || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="State"
                name="state"
                fullWidth
                required
                value={formData?.state || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Country"
                name="country"
                fullWidth
                required
                value={formData?.country || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                type="number"
                label="Pincode"
                name="pincode"
                fullWidth
                required
                value={formData?.pincode || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="GSTIN"
                name="gstin"
                fullWidth
                required
                value={formData?.gstin || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={gstinTypeList || []}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="GSTIN Type"
                    name="gstin_type"
                    required
                  />
                )}
                value={formData?.gstin_type || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "gstin_type", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Address Line 1"
                name="address1"
                fullWidth
                required
                value={formData?.address1 || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Address Line 2"
                name="address2"
                fullWidth
                value={formData?.address2 || ""}
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

AddNewSupplierModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  gstinTypeList: PropTypes.array,
};

export default AddNewSupplierModal;
