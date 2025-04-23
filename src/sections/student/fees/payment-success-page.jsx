import { Box, Button, Typography } from "@mui/material";
import { TaskAltRounded } from "@mui/icons-material";

const PaymentSuccessPage = () => {
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
      <Typography variant="h3">THANK YOU !</Typography>
      <TaskAltRounded sx={{ fontSize: "120px", color: "success.main" }} />
      <Typography variant="h5" sx={{ textAlign: "center" }}>
        Transaction Successful
      </Typography>
      <Button variant="contained" sx={{ textTransform: "none" }}>
        Download Receipt
      </Button>
    </Box>
  );
};

export default PaymentSuccessPage;
