import PropTypes from "prop-types";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";

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
            <Typography>₹ {row?.fpp_amount || ""}</Typography>
            <Typography sx={{ color: "error.main" }}>
              ₹ {row?.fpp_late_fee || ""}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography noWrap>
            {row?.fpp_due_date
              ? dayjs(row?.fpp_due_date).format("YYYY-MM-DD")
              : "-"}
          </Typography>
        </TableCell>

        <TableCell sx={{ width: "110px" }}>
          ₹ {row?.f_concession || "-"}
        </TableCell>
        {/* <TableCell sx={{ width: "110px" }}>
          {row?.fpp_late_fee || "-"}
        </TableCell> */}

        <TableCell>₹ {row?.total_amount || "-"}</TableCell>
      </TableRow>
    </>
  );
};

PaidFeesTableRow.propTypes = {
  row: PropTypes.object,
  detail: PropTypes.object,
};

export default PaidFeesTableRow;
