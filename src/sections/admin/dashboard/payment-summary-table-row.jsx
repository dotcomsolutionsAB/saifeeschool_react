import PropTypes from "prop-types";
import { Box, TableCell, TableRow } from "@mui/material";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";
import { useNavigate } from "react-router-dom";

const PaymentSummaryTableRow = ({ sn, row }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/fees-management/fees", { state: row });
  };
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

        <TableCell>
          <Box
            sx={{
              color: "primary.main",
              cursor: "pointer",
              fontWeight: 600,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
            onClick={handleClick}
          >
            ₹ {FORMAT_INDIAN_CURRENCY(row?.fee_due) || "0"}
          </Box>
        </TableCell>
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
