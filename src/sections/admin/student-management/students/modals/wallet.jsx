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
import useAuth from "../../../../../hooks/useAuth";
import { CancelOutlined } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useStudent from "../../../../../hooks/useStudent";
import { addMoneyToWallet } from "../../../../../services/admin/transactions.service";

const TYPE_LIST = [
  {
    id: "1",
    label: "Draft",
    value: "draft",
  },
  {
    id: "2",
    label: "NEFT",
    value: "neft",
  },
  {
    id: "3",
    label: "Payment Gateway",
    value: "pg",
  },
  {
    id: "4",
    label: "Transport",
    value: "transport",
  },
];

const WalletModal = ({ open, onClose, detail }) => {
  const { logout } = useAuth();
  const { refetch } = useStudent();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await addMoneyToWallet({
      ...formData,
      type: formData?.type?.value,
      st_id: detail?.id,
      amount: Number(formData?.amount),
    });
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      refetch();
      toast.success(response?.message || "Money added to wallet successfully.");
    } else if (response?.code === 401) {
      logout(response);
      // toast.error(response?.message || "Unauthorized");
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
          minWidth: { xs: "95%", sm: "600px", md: "800px", lg: "1100px" },
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
        Add Money To Wallet
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                options={TYPE_LIST || []}
                getOptionLabel={(option) => option?.label || ""} // it is necessary for searching the options
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="type"
                    label="Type"
                    fullWidth
                    required
                  />
                )}
                value={formData?.type || null}
                onChange={(_, newValue) =>
                  handleChange({ target: { name: "type", value: newValue } })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData?.amount ?? 0}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Comments"
                name="comments"
                value={formData?.comments || ""}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <DatePicker
                label="Date"
                name="date"
                value={formData?.date ? dayjs(formData?.date) : null}
                onChange={(newValue) =>
                  handleChange({ target: { name: "date", value: newValue } })
                }
                required
                fullWidth
                slotProps={{
                  textField: { required: true, fullWidth: true },
                }}
              />
            </Grid>

            {/* if type is draft */}

            {formData?.type?.value === "draft" && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      label="Bank Name"
                      name="bank_name"
                      value={formData?.bank_name || ""}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      label="Draft Number"
                      name="draft_no"
                      value={formData?.draft_no || ""}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DatePicker
                      label="Draft Date"
                      name="draft_date"
                      value={
                        formData?.draft_date
                          ? dayjs(formData?.draft_date)
                          : null
                      }
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: "draft_date", value: newValue },
                        })
                      }
                      required
                      fullWidth
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* if type is neft or pg*/}
            {(formData?.type?.value === "neft" ||
              formData?.type?.value === "pg") && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      label="Transaction ID"
                      name="transaction_id"
                      value={formData?.transaction_id || ""}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <DatePicker
                      label="Transaction Date"
                      name="transaction_date"
                      value={
                        formData?.transaction_date
                          ? dayjs(formData?.transaction_date)
                          : null
                      }
                      onChange={(newValue) =>
                        handleChange({
                          target: { name: "transaction_date", value: newValue },
                        })
                      }
                      required
                      fullWidth
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            {/* if type is transport*/}
            {formData?.type?.value === "transport" && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      label="Receipt No"
                      name="receipt_no"
                      value={formData?.receipt_no || ""}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12}>
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
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button variant="contained" type="submit" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : `Save`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

WalletModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  detail: PropTypes.object,
};

export default WalletModal;
