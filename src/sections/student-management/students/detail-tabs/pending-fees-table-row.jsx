import PropTypes from "prop-types";
import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import Iconify from "../../../../components/iconify/iconify";

const PendingFeesTableRow = ({ row, isRowSelected, handleClick, refetch }) => {
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={isRowSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={isRowSelected}
            onChange={() => handleClick(row?.id)}
          />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {row?.fpp_name || "-"}
          </Typography>
        </TableCell>

        <TableCell>{row?.fpp_amount || "-"}</TableCell>

        <TableCell>{row?.fpp_due_date || "-"}</TableCell>

        <TableCell>{row?.f_concession || "-"}</TableCell>

        <TableCell>{row?.fpp_late_fee || "-"}</TableCell>

        <TableCell>{row?.fpp_late_fee_applicable || "-"}</TableCell>

        <TableCell>{row?.total_amount || "-"}</TableCell>

        <TableCell align="center">
          <IconButton sx={{ cursor: "pointer", color: "error.main" }}>
            <Iconify icon="material-symbols:delete-outline-rounded" />
          </IconButton>
        </TableCell>
      </TableRow>
    </>
  );
};

PendingFeesTableRow.propTypes = {
  row: PropTypes.object,
  isRowSelected: PropTypes.bool,
  handleClick: PropTypes.func,
  refetch: PropTypes.func,
};

export default PendingFeesTableRow;
