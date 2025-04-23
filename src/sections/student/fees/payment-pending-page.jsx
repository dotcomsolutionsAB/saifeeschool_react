import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { PendingOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PaymentPendingPage = ({ transactionData }) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/");
  };
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
      <Typography variant="h3">PENDING !</Typography>
      <PendingOutlined sx={{ fontSize: "120px", color: "warning.main" }} />
      <Typography variant="h5" color="warning" sx={{ textAlign: "center" }}>
        {`We're Sorry for the Inconveience.`}
      </Typography>
      <Typography color="warning" sx={{ textAlign: "center" }}>
        {transactionData?.description || ""}
      </Typography>
      <Button
        variant="contained"
        sx={{ textTransform: "none" }}
        onClick={handleDashboard}
      >
        Dashboard
      </Button>
    </Box>
  );
};

PaymentPendingPage.propTypes = {
  transactionData: PropTypes.object,
};

export default PaymentPendingPage;
