import { CancelOutlined } from "@mui/icons-material";
import {
  Dialog,
  DialogActions,
  Button,
  CircularProgress,
  DialogContent,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";

const DisclaimerDialog = ({
  open,
  onConfirm,
  onCancel,
  isLoading,
  furtherToPay,
}) => {
  return (
    <Dialog
      open={open}
      // onClose={onCancel} // Uncomment if you want to close the dialog by clicking outside
      aria-labelledby="disclaimer-dialog-title"
      aria-describedby="disclaimer-dialog-description"
      PaperProps={{
        sx: {
          minWidth: { xs: "95vw", sm: "600px", md: "800px" },
          position: "relative",
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "warning.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 600,
          color: "primary.darker",
          position: "relative",
        }}
      >
        Disclaimer
        <IconButton onClick={onCancel} sx={{ position: "absolute", right: 8 }}>
          <CancelOutlined />
        </IconButton>
      </Box>
      {furtherToPay > 0 ? (
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {`You will now be redirected to the CC Avenue Payment Gateway where you can pay through Net Banking or Debit Card (of any bank).`}
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {`Your financial information (card number, username, password, OTP, etc.) will be entered by you directly on the CC Avenue Payment Gateway. At no point of time does the school or the website developer come in possession of this information and hence is not liable for the misuse of this information.`}
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>Bank Charges</Typography>
          <Typography>
            {`Net Banking: The school shall bear the bank charges.`}
          </Typography>
          <Typography>
            {`Debit Card: You will need to bear the charges. These will be shown to you on the next page.`}
          </Typography>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography variant="h6" sx={{ textAlign: "center", mb: 1 }}>
            {`Are you sure you want to adjust the fees?`}
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", color: "warning.main" }}
          >
            {`This will deduct the amount from your wallet.`}
          </Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ textAlign: "right" }}>
        <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
          Close
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={isLoading}>
          {isLoading ? (
            <CircularProgress size={27} color="inherit" />
          ) : (
            `${furtherToPay > 0 ? `Pay ₹${furtherToPay}` : "Adjust Fees"}`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DisclaimerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  furtherToPay: PropTypes.number,
};

export default DisclaimerDialog;
