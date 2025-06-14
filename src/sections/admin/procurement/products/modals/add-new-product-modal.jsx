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
  createProduct,
  updateProduct,
} from "../../../../../services/admin/procurement.service";

const AddNewProductModal = ({
  open,
  onClose,
  refetch,
  detail,
  productCategoryList,
  unitsList,
}) => {
  const { logout } = useAuth();

  const initialState = {
    category: "",
    sub_category: "",
    name: "",
    description: "",
    unit: "",
    price: "",
    discount: "",
    tax: "",
    hsn: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateProduct(formData);
    } else {
      response = await createProduct(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `Product ${detail?.id ? "updated" : "added"} successfully`
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
        category: detail?.category || "",
        sub_category: detail?.sub_category || "",
        name: detail?.name || "",
        description: detail?.description || "",
        unit: detail?.unit || "",
        price: detail?.price || "",
        discount: detail?.discount || "",
        tax: detail?.tax || "",
        hsn: detail?.hsn || "",
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
        {detail?.id ? "Edit Product" : `Add New Product`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={productCategoryList || []}
                getOptionLabel={(option) => option || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Product Category"
                    name="category"
                  />
                )}
                value={formData?.category || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "category", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Sub Category"
                name="sub_category"
                fullWidth
                value={formData?.sub_category || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                required
                value={formData?.name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                value={formData?.description || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={unitsList || []}
                getOptionLabel={(option) => option?.toUpperCase() || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Unit" name="unit" required />
                )}
                value={formData?.unit || null}
                onChange={(_, newValue) => {
                  handleChange({ target: { name: "unit", value: newValue } });
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                fullWidth
                required
                value={formData?.price || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount (%)"
                name="discount"
                fullWidth
                value={formData?.discount || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tax"
                name="tax"
                fullWidth
                required
                value={formData?.tax || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="HSN"
                name="hsn"
                fullWidth
                value={formData?.hsn || ""}
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

AddNewProductModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  productCategoryList: PropTypes.array,
  unitsList: PropTypes.array,
};

export default AddNewProductModal;
