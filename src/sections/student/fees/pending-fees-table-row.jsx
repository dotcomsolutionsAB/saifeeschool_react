import PropTypes from "prop-types";
import { Box, Checkbox, TableCell, TableRow, Typography } from "@mui/material";

import dayjs from "dayjs";
import { FORMAT_INDIAN_CURRENCY } from "../../../utils/constants";

const PendingFeesTableRow = ({
  row,
  isRowSelected,
  handleClick,
  selectedRowIds,
  rows,
  allResponse,
}) => {
  // Check if current row is compulsory (monthly fee)
  const isCompulsory = row?.is_compulsory === "1";

  let isDisabled = false;

  if (isCompulsory) {
    // For compulsory fees, find the previous compulsory fee and check if it's selected
    const compulsoryRows = rows.filter((r) => r?.is_compulsory === "1");
    const currentCompulsoryIndex = compulsoryRows.findIndex(
      (r) => r.id === row.id
    );

    if (currentCompulsoryIndex > 0) {
      const previousCompulsoryRow = compulsoryRows[currentCompulsoryIndex - 1];
      isDisabled = !selectedRowIds.includes(previousCompulsoryRow?.id);
    }
  }
  // For non-compulsory fees (is_compulsory === "0"), isDisabled remains false

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        {allResponse?.last_payment_status !== "pending" && (
          <TableCell padding="checkbox">
            <Checkbox
              disableRipple
              checked={isRowSelected}
              onChange={() => handleClick(row)}
              disabled={isDisabled} // Disable based on previous row's selection
            />
          </TableCell>
        )}

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
              ? dayjs(row?.fpp_due_date).format("DD-MM-YYYY")
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

PendingFeesTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  selectedRowIds: PropTypes.array.isRequired, // Array of selected row IDs
  rows: PropTypes.array.isRequired, // Full list of rows to check previous row
  allResponse: PropTypes.object, // Response object containing payment status
};

export default PendingFeesTableRow;
