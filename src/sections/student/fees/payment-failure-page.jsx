import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { CancelOutlined } from "@mui/icons-material";

const PaymentFailurePage = ({ transactionData }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3">ERROR !</Typography>
      <CancelOutlined sx={{ fontSize: "120px", color: "error.main" }} />
      <Typography variant="h5" color="error" sx={{ textAlign: "center" }}>
        Transaction Failed
      </Typography>
      {transactionData?.description?.length > 0 && (
        <Typography color="error" sx={{ textAlign: "center" }}>
          Reason: {transactionData?.description || ""}
        </Typography>
      )}
      {/* <Button variant="contained" sx={{ textTransform: "none" }}>
        Reconcile
      </Button> */}
    </Box>
  );
};

PaymentFailurePage.propTypes = {
  transactionData: PropTypes.object,
};

export default PaymentFailurePage;
