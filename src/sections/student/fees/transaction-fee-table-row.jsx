import PropTypes from "prop-types";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  CAPITALIZE,
  FORMAT_INDIAN_CURRENCY,
  REMOVE_UNDERSCORE,
} from "../../../utils/constants";

const TransactionFeesTableRow = ({ row, rowIndex }) => {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{rowIndex}</TableCell>
        <TableCell>
          <Box>
            <Typography>{row?.student_name || ""}</Typography>
            <Typography>{row?.class_name || "-"}</Typography>
            <Typography variant="subtitle2">
              {row?.st_roll_no || "-"}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography>
            {row?.txn_date ? dayjs(row?.txn_date).format("DD-MM-YYYY") : "-"}
          </Typography>
        </TableCell>

        <TableCell>{REMOVE_UNDERSCORE(row?.txn_from) || "-"}</TableCell>
        <TableCell>{REMOVE_UNDERSCORE(row?.txn_to) || "-"}</TableCell>
        <TableCell>{row?.narration || "-"}</TableCell>
        <TableCell>
          <Box>
            <Typography>{CAPITALIZE(row?.mode) || ""}</Typography>
            <Typography variant="subtitle2">{row?.txn_id || "-"}</Typography>
          </Box>
        </TableCell>
        <TableCell>₹ {FORMAT_INDIAN_CURRENCY(row?.amount) || "0"}</TableCell>
      </TableRow>
    </>
  );
};

TransactionFeesTableRow.propTypes = {
  row: PropTypes.object,
  rowIndex: PropTypes.number,
};

export default TransactionFeesTableRow;
