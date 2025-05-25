import PropTypes from "prop-types";
import { TableCell, TableRow } from "@mui/material";

const TeachersAttendanceTableRow = ({ row, index, page, rowsPerPage }) => {
  return (
    <>
      <TableRow hover tabIndex={-1} key={row?.id}>
        <TableCell>{page * rowsPerPage + index + 1 || ""}</TableCell>

        <TableCell>{row?.teacher_name || "-"}</TableCell>
        <TableCell>{row?.teacher_email || "-"}</TableCell>

        <TableCell>{row?.attendance === "1" ? "Present" : "Absent"}</TableCell>
      </TableRow>
    </>
  );
};

TeachersAttendanceTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};

export default TeachersAttendanceTableRow;
