import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";

import PropTypes from "prop-types";

const ConfirmationDialog = ({
  open,
  title,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
    <Dialog
      open={open}
      // onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          minWidth: { xs: "80vw", sm: "300px" },
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: "center" }}>
        {title || "Are you sure you want to proceed?"}
      </DialogTitle>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" disabled={isLoading}>
          No
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={27} color="inherit" /> : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
};

export default ConfirmationDialog;
