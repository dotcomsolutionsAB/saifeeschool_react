import { ClearRounded, DoneRounded } from "@mui/icons-material";
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
    >
      <DialogTitle id="confirmation-dialog-title">
        {title || "Are you sure you want to proceed?"}
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={isLoading}
          sx={{
            bgcolor: "error.main",
            color: "error.contrastText",
          }}
        >
          <ClearRounded sx={{ fontSize: "18px" }} />
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isLoading}
          sx={{
            bgcolor: "secondary.main",
            color: "secondary.contrastText",
            "&:hover": {
              bgcolor: "secondary.dark",
              color: "secondary.contrastText",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={27} color="inherit" />
          ) : (
            <DoneRounded sx={{ fontSize: "18px" }} />
          )}
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
