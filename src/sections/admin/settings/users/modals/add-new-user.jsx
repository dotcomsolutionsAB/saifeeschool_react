import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import useAuth from "../../../../../hooks/useAuth";
import {
  CancelOutlined,
  CheckBox,
  CheckBoxOutlineBlank,
  VisibilityOffRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import {
  createUser,
  updateUser,
} from "../../../../../services/admin/users.service";
import { CAPITALIZE } from "../../../../../utils/constants";

const AddNewUserModal = ({
  open,
  onClose,
  refetch,
  detail,
  userTypeList = [],
  modulesList = [],
}) => {
  const { logout } = useAuth();

  const initialState = {
    name: "",
    username: "",
    password: "",
    mobile: "",
    email: "",
    role: "",
    access_to: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]); // to select multiple checkboxes in class field

  const handleShowPassword = () => {
    setShowPassword((preValue) => !preValue);
  };

  // for multiple checkbox selection
  const handleSelectionChange = (event, newValues) => {
    // Check if "all" was selected
    const isAllSelected =
      newValues.includes("all") ||
      newValues?.length === modulesList?.length - 1;

    if (isAllSelected) {
      // Set only "all"
      setSelectedOptions(["all"]);
      handleChange({
        target: { name: "access_to", value: "all" },
      });
    } else {
      // Set only other options
      setSelectedOptions(newValues);
      handleChange({
        target: { name: "access_to", value: newValues.join(",") },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOptions || selectedOptions?.length === 0) {
      toast.error("Please select at least one module");
      return;
    }
    let response;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateUser(formData);
    } else {
      response = await createUser(formData);
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(
        response?.message ||
          `User ${detail?.id ? "updated" : "added"} successfully`
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
        username: detail?.username || "",
        password: detail?.password || "",
        mobile: detail?.mobile || "",
        email: detail?.email || "",
        role: detail?.role || "",
        access_to: detail?.access_to || "",
      });
      setSelectedOptions(detail?.access_to?.split(",") || []);
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
        {detail?.id ? "Edit User" : `Add New User`}
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
                label="Username"
                name="username"
                fullWidth
                required
                value={formData?.username || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type={`${showPassword ? "text" : "password"}`}
                label="Password"
                name="password"
                value={formData?.password || ""}
                onChange={handleChange}
                required={detail?.id ? false : true}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPassword ? (
                          <VisibilityOffRounded
                            onClick={handleShowPassword}
                            cursor="pointer"
                            fontSize="24px"
                          />
                        ) : (
                          <VisibilityRounded
                            onClick={handleShowPassword}
                            cursor="pointer"
                            fontSize="24px"
                          />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Mobile"
                name="mobile"
                fullWidth
                required
                value={formData?.mobile || ""}
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
                options={userTypeList || []}
                getOptionLabel={(option) => CAPITALIZE(option) || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User Type"
                    name="role"
                    required
                  />
                )}
                value={formData?.role || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "role", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                limitTags={1}
                options={modulesList || []}
                getOptionLabel={(option) => CAPITALIZE(option) || ""}
                getOptionDisabled={(option) =>
                  selectedOptions.includes("all") && option !== "all"
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Module Permission"
                    name="access_to"
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option}>
                    <Checkbox
                      size="small"
                      icon={<CheckBoxOutlineBlank fontSize="small" />}
                      checkedIcon={<CheckBox fontSize="small" />}
                      checked={selected}
                      sx={{ mr: 1 }}
                    />
                    {CAPITALIZE(option) || ""}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected?.map((option, index) => (
                    <Chip
                      label={CAPITALIZE(option)}
                      size="small"
                      {...getTagProps({ index })}
                      key={option || index}
                    />
                  ))
                }
                value={selectedOptions || []}
                onChange={handleSelectionChange}
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

AddNewUserModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  userTypeList: PropTypes.array,
  modulesList: PropTypes.array,
};

export default AddNewUserModal;
