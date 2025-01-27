import { Box } from "@mui/material";
import ListTable from "./tables/list-table";
import { v4 as uuidv4 } from "uuid";

const PaymentSummaryTable = () => {
  const HEAD_LABEL = [
    {
      id: "sn",
      label: "SN",
      width: "50px",
    },
    {
      id: "month",
      label: "Month",
      width: "150px",
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      width: "150px",
    },
    {
      id: "amountDue",
      label: "Amount Due",
      width: "150px",
    },
    {
      id: "lateFeeCollected",
      label: "Late Fee Collected",
      width: "180px",
    },
  ];

  const DATA = [
    {
      sn: 1,
      month: "January",
      totalAmount: "$1000",
      amountDue: "$200",
      lateFeeCollected: "$50",
    },
    {
      sn: 2,
      month: "February",
      totalAmount: "$1200",
      amountDue: "$300",
      lateFeeCollected: "$40",
    },
    {
      sn: 3,
      month: "March",
      totalAmount: "$900",
      amountDue: "$100",
      lateFeeCollected: "$30",
    },
  ];

  const TABLE_LIST = DATA?.map((item) => ({
    ...item,
    _id: uuidv4(),
  }));

  return (
    <Box sx={{ height: "100%" }}>
      <ListTable
        tableList={TABLE_LIST}
        headLabel={HEAD_LABEL}
        orderByName="sn"
      />
    </Box>
  );
};

export default PaymentSummaryTable;
