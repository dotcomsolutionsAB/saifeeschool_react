import PropTypes from "prop-types";
import { Box, Checkbox, TableCell, TableRow, Typography } from "@mui/material";

import dayjs from "dayjs";

const PendingFeesTableRow = ({
  row,
  isRowSelected,
  handleClick,
  index,
  selectedRows,
  rows,
}) => {
  const isDisabled = index > 0 && !selectedRows.includes(rows[index - 1]?.id);
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={isRowSelected}
            onChange={() => handleClick(row?.id)}
            disabled={isDisabled} // Disable based on previous row's selection
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          <Box>
            <Typography>₹ {row?.fpp_amount || ""}</Typography>
            <Typography sx={{ color: "error.main" }}>
              ₹ {row?.fpp_late_fee || "0"}
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
          ₹ {row?.f_concession || "0"}
        </TableCell>
        {/* <TableCell sx={{ width: "110px" }}>
          {row?.fpp_late_fee || "-"}
        </TableCell> */}

        <TableCell>₹ {row?.total_amount || "0"}</TableCell>
      </TableRow>
    </>
  );
};

PendingFeesTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  index: PropTypes.number.isRequired, // Index of the current row
  selectedRows: PropTypes.array.isRequired, // Array of selected row IDs
  rows: PropTypes.array.isRequired, // Full list of rows to check previous row
};

export default PendingFeesTableRow;
