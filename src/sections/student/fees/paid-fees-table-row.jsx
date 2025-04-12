import PropTypes from "prop-types";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";

const PaidFeesTableRow = ({ row }) => {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          <Box>
            <Typography>
              ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_amount) || ""}
            </Typography>
            {Number(row?.fpp_late_fee) > 0 &&
              row?.f_late_fee_applicable === "1" && (
                <Typography sx={{ color: "error.main" }}>
                  ₹ {FORMAT_INDIAN_CURRENCY(row?.fpp_late_fee) || "0"}
                </Typography>
              )}
            {Number(row?.f_concession) > 0 && (
              <Typography sx={{ color: "success.main" }}>
                ₹ {FORMAT_INDIAN_CURRENCY(row?.f_concession) || "0"}
              </Typography>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Typography noWrap>
            {row?.fpp_due_date
              ? dayjs(row?.fpp_due_date).format("YYYY-MM-DD")
              : "-"}
          </Typography>
        </TableCell>

        <TableCell>
          ₹ {FORMAT_INDIAN_CURRENCY(row?.total_amount) || "0"}
        </TableCell>
      </TableRow>
    </>
  );
};

PaidFeesTableRow.propTypes = {
  row: PropTypes.object,
  detail: PropTypes.object,
};

export default PaidFeesTableRow;
