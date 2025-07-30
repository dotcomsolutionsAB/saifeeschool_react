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
import { transferMoney } from "../../../../../services/admin/transactions.service";

const TRANSFER_FROM_LIST = ["Deposit", "Wallet"];
const TRANSFER_TO_LIST = ["Wallet", "School"];

const TransferMoneyModal = ({
  open,
  onClose,
  detail,
  studentDetailRefetch,
}) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({ ...preValue, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await transferMoney({
      ...formData,
      st_id: detail?.id,
      transfer_amount: Number(formData?.transfer_amount),
    });
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      studentDetailRefetch();
      toast.success(response?.message || "Money added to wallet successfully.");
    } else if (response?.code === 401) {
      logout(response);
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
        Transfer Money
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Autocomplete
                options={TRANSFER_FROM_LIST || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Transfer From"
                    fullWidth
                    required
                  />
                )}
                value={formData?.transfer_from || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "transfer_from", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Autocomplete
                options={TRANSFER_TO_LIST || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Transfer To"
                    fullWidth
                    required
                  />
                )}
                value={formData?.transfer_to || null}
                onChange={(_, newValue) =>
                  handleChange({
                    target: { name: "transfer_to", value: newValue },
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TextField
                type="number"
                label="Amount"
                name="transfer_amount"
                value={formData?.transfer_amount ?? 0}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <TextField
                label="Comments"
                name="transfer_comments"
                value={formData?.transfer_comments || ""}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>

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

TransferMoneyModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  detail: PropTypes.object,
  studentDetailRefetch: PropTypes.func,
};

export default TransferMoneyModal;
