import PropTypes from "prop-types";
import { memo, useState } from "react";
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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  createDebitVoucher,
  updateDebitVoucher,
} from "../../../../../services/admin/accounts.service";

const CreateEditDebitVoucherModal = ({
  open,
  onClose,
  refetch,
  detail,
  debit_from_to_list,
  isLoadingFromTo,
}) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const initialState = {
    date: detail?.date
      ? dayjs(detail?.date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD"),
    from: detail?.from || "",
    debit: detail?.debit || "",
    amount: Number(detail?.amount) || 0,
    paid_to: detail?.paid_to || "",
    cheque_no: detail?.cheque_no || "",
    description: detail?.description || "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue =
      type === "date"
        ? dayjs(value).format("YYYY-MM-DD")
        : type === "number"
        ? Number(value)
        : value;
    setFormData((preValue) => ({
      ...preValue,
      [name]: parsedValue,
    }));
  };

  const handleCreateEditDebitVoucher = async (e) => {
    e.preventDefault();
    let response = null;
    setIsLoading(true);
    if (detail?.id) {
      response = await updateDebitVoucher({
        ...formData,
        id: detail.id,
      });
    } else {
      response = await createDebitVoucher({
        ...formData,
      });
    }
    setIsLoading(false);

    if (response?.code === 200) {
      onClose();
      setFormData(initialState);
      refetch();
      toast.success(
        response?.message ||
          `${
            detail?.id ? "Debit voucher created" : "Debit voucher updated"
          } successfully`
      );
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
        {detail?.id ? "Edit Debit Voucher" : `Add New Debit Voucher`}
      </Box>

      <DialogContent>
        <Box component="form" onSubmit={handleCreateEditDebitVoucher}>
          <Grid container spacing={4}>
            {/* Date */}
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                name="date"
                label="Date"
                value={formData?.date ? dayjs(formData?.date) : null}
                onChange={(newValue) =>
                  handleChange({
                    target: { type: "date", name: "date", value: newValue },
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
            {/* Debit From*/}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={
                  isLoadingFromTo
                    ? ["Loading..."]
                    : debit_from_to_list?.from || []
                }
                value={formData?.from || null}
                onChange={(event, newValue) => {
                  if (newValue !== "Loading...") {
                    handleChange({
                      target: { name: "from", value: newValue },
                    });
                  }
                }}
                loading={isLoadingFromTo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="from"
                    label="Debit From"
                    required
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingFromTo ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {/* Debit */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                options={
                  isLoadingFromTo
                    ? ["Loading..."]
                    : debit_from_to_list?.debit || []
                }
                value={formData?.debit || null}
                onChange={(event, newValue) => {
                  if (newValue !== "Loading...") {
                    handleChange({
                      target: { name: "debit", value: newValue },
                    });
                  }
                }}
                loading={isLoadingFromTo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="debit"
                    label="Debit"
                    required
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoadingFromTo ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                type="number"
                name="amount"
                label="Amount"
                required
                fullWidth
                value={formData?.amount || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Paid To */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="paid_to"
                label="Paid To"
                required
                fullWidth
                value={formData?.paid_to || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* Cheque No*/}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="cheque_no"
                label="Cheque No"
                fullWidth
                value={formData?.cheque_no || ""}
                onChange={handleChange}
              />
            </Grid>

            {/* on_account_of */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="On Account Of"
                multiline
                rows={3}
                required
                fullWidth
                value={formData?.description || ""}
                onChange={handleChange}
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
              {isLoading ? (
                <CircularProgress size={24} />
              ) : detail?.id ? (
                `Update`
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

CreateEditDebitVoucherModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
  detail: PropTypes.object,
  debit_from_to_list: PropTypes.object,
  isLoadingFromTo: PropTypes.bool,
};

export default memo(CreateEditDebitVoucherModal);
