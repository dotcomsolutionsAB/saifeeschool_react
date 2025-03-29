import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";

const PaymentSummaryTableRow = ({ sn, row }) => {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{sn || "-"}</TableCell>

        <TableCell>
          {row?.category === "monthly_fees"
            ? row?.month_name || row?.month_no || "0"
            : row?.category || "-"}
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.total_amount) || "0"}
        </TableCell>

        <TableCell>₹ {FORMAT_INDIAN_CURRENCY(row?.fee_due) || "0"}</TableCell>
        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.late_fee_collected) || "0"}
        </TableCell>
      </TableRow>
    </>
  );
};

PaymentSummaryTableRow.propTypes = {
  row: PropTypes.object,
  sn: PropTypes.number,
};

export default PaymentSummaryTableRow;
