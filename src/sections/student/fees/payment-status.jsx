import { useLocation } from "react-router-dom";
import PaymentSuccessPage from "./payment-success-page";
import PaymentFailurePage from "./payment-failure-page";
import PaymentPendingPage from "./payment-pending-page";
import { Card, CardContent } from "@mui/material";
import useLayout from "../../../hooks/uesLayout";
import { useGetApi } from "../../../hooks/useGetApi";
import { getTransactionStatus } from "../../../services/student/fees.service";

const PaymentStatus = () => {
  const location = useLocation();
  const { layout } = useLayout();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const txn_id = queryParams.get("txn_id");

  // Only call the API if txn_id exists
  const { allResponse: transactionData } = useGetApi({
    apiFunction: getTransactionStatus,
    body: txn_id ? { txn_id } : null,
    skip: !txn_id, // Add `skip` to prevent running when txn_id is missing
  });

  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: `calc(100vh - ${layout?.headerHeight} - 110px)`,
        }}
      >
        {status === "success" ? (
          <PaymentSuccessPage />
        ) : status === "pending" ? (
          <PaymentPendingPage transactionData={transactionData} />
        ) : (
          <PaymentFailurePage transactionData={transactionData} />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;
